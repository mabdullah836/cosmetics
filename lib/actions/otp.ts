"use server";

import nodemailer from "nodemailer";
import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { MESSAGES, CONFIG } from "@/lib/constants";
import { buildOTPEmailHtml } from "@/lib/email/otp-template";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const OTP_EMAIL_FROM =
  process.env.OTP_EMAIL_FROM || "Bloom <noreply@example.com>";
/**
 * Send the OTP code to the user's email via Nodemailer SMTP (COD verification only).
 * If SMTP_HOST is not set, logs the OTP and returns success (for local dev).
 */
async function sendOTPEmail(email: string, otp: string): Promise<{ ok: boolean; error?: string }> {
  if (!SMTP_HOST) {
    logger.log(
      `[OTP] Code for ${email}: ${otp} (valid ${CONFIG.OTP_EXPIRY_MINUTES} min). Set SMTP_HOST to send real emails.`
    );
    return { ok: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth:
        SMTP_USER && SMTP_PASS
          ? { user: SMTP_USER, pass: SMTP_PASS }
          : undefined,
    });
    const info = await transporter.sendMail({
      from: OTP_EMAIL_FROM,
      to: email,
      subject: `Your verification code is ${otp}`,
      html: buildOTPEmailHtml(otp, CONFIG.OTP_EXPIRY_MINUTES),
    });

    logger.log(`OTP email sent to ${email} (messageId: ${info.messageId ?? "n/a"})`);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send OTP email";
    logger.error("OTP email send exception:", err);
    return { ok: false, error: message };
  }
}

interface OTPRecord {
  email: string;
  otp: string;
  expires_at: string;
  attempts: number;
  verified: boolean;
}

// Generate OTP
function generateOTP(): string {
  return Math.floor(
    Math.pow(10, CONFIG.OTP_LENGTH - 1) + 
    Math.random() * (Math.pow(10, CONFIG.OTP_LENGTH) - Math.pow(10, CONFIG.OTP_LENGTH - 1))
  ).toString();
}

// Send OTP via email using Supabase Auth
export async function sendOTP(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const serviceSupabase = createServiceClient();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email address" };
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check for recent failed attempts (fraud prevention)
    const { data: recentAttempts } = await serviceSupabase
      .from("otp_verifications")
      .select("attempts, created_at")
      .eq("email", cleanEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentAttempts && recentAttempts.attempts >= 5) {
      const lastAttempt = new Date(recentAttempts.created_at);
      const hoursSince = (Date.now() - lastAttempt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSince < 24) {
        return {
          success: false,
          error: "Too many failed attempts. Please try again later.",
        };
      }
    }

    // Check for blocked emails
    const { data: blocked } = await serviceSupabase
      .from("blocked_emails")
      .select("email")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (blocked) {
      return {
        success: false,
        error: "This email cannot be used for orders.",
      };
    }

    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + CONFIG.OTP_EXPIRY_MINUTES);

    // Store OTP in database
    const { error: insertError } = await serviceSupabase.from("otp_verifications").insert({
      email: cleanEmail,
      otp: otp,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
      verified: false,
    });

    if (insertError) {
      logger.error(MESSAGES.OTP.STORAGE_ERROR, insertError);
      return { success: false, error: MESSAGES.OTP.SEND_ERROR };
    }

    // Send OTP email for COD verification (not magic link — we only need to deliver the 6-digit code)
    const sendResult = await sendOTPEmail(cleanEmail, otp);
    if (!sendResult.ok) {
      logger.error("OTP email failed:", sendResult.error);
      return { success: false, error: MESSAGES.OTP.SEND_ERROR };
    }

    logger.log(`OTP sent successfully to ${cleanEmail}`);
    return { success: true };
  } catch (error) {
    logger.error(MESSAGES.OTP.SEND_ERROR, error);
    return { success: false, error: MESSAGES.OTP.SEND_ERROR };
  }
}

export async function verifyOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();
    const cleanEmail = email.toLowerCase().trim();

    // Find the most recent unverified OTP for this email
    const { data: otpRecord, error: fetchError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", cleanEmail)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !otpRecord) {
      return { success: false, error: MESSAGES.OTP.INVALID };
    }

    // Check if OTP is expired
    const expiresAt = new Date(otpRecord.expires_at);
    if (expiresAt < new Date()) {
      return { success: false, error: MESSAGES.OTP.EXPIRED };
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return {
        success: false,
        error: "Too many failed attempts. Please request a new OTP.",
      };
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await supabase
        .from("otp_verifications")
        .update({ attempts: otpRecord.attempts + 1 })
        .eq("id", otpRecord.id);

      return { success: false, error: MESSAGES.OTP.INVALID };
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    if (updateError) {
      return { success: false, error: MESSAGES.OTP.VERIFY_ERROR };
    }

    return { success: true };
  } catch (error) {
    logger.error(MESSAGES.OTP.VERIFY_ERROR, error);
    return { success: false, error: MESSAGES.OTP.VERIFY_ERROR };
  }
}
