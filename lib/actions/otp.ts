"use server";

import { createServiceClient, createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { MESSAGES, CONFIG } from "@/lib/constants";

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
    const supabase = await createClient();
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

    // Send OTP via Supabase Auth email (uses your SMTP config)
    const { error: emailError } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
        data: {
          otp_code: otp,
          purpose: 'cod_verification'
        },
        shouldCreateUser: false, // Don't create user, just send email
      },
    });

    if (emailError) {
      logger.error("Email send error:", emailError);
      // Still return success if OTP is stored, as we can verify it later
      logger.log(`[DEV] OTP for ${cleanEmail}: ${otp}`);
    } else {
      logger.log(`OTP sent successfully to ${cleanEmail}`);
    }

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
