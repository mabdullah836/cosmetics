"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { MESSAGES, CONFIG } from "@/lib/constants";

interface OTPRecord {
  phone: string;
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

// Store OTP in database (you'll need to create an otp_verifications table)
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/\D/g, "");
    
    if (cleanPhone.length < 10) {
      return { success: false, error: "Invalid phone number" };
    }

    // Check for recent failed attempts (fraud prevention)
    const { data: recentAttempts } = await supabase
      .from("otp_verifications")
      .select("attempts, created_at")
      .eq("phone", cleanPhone)
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

    // Check for blocked phone numbers
    const { data: blocked } = await supabase
      .from("blocked_phones")
      .select("phone")
      .eq("phone", cleanPhone)
      .maybeSingle();

    if (blocked) {
      return {
        success: false,
        error: "This phone number cannot be used for orders.",
      };
    }

    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + CONFIG.OTP_EXPIRY_MINUTES);

    // Store OTP in database
    const { error } = await supabase.from("otp_verifications").insert({
      phone: cleanPhone,
      otp: otp, // In production, hash this
      expires_at: expiresAt.toISOString(),
      attempts: 0,
      verified: false,
    });

    if (error) {
      logger.error(MESSAGES.OTP.STORAGE_ERROR, error);
      return { success: false, error: MESSAGES.OTP.SEND_ERROR };
    }

    // In production, send SMS via Twilio, AWS SNS, etc.
    // For development, log the OTP
    logger.log(`[DEV] OTP for ${cleanPhone}: ${otp}`);

    // TODO: Integrate with SMS service
    // await sendSMS(cleanPhone, `Your verification code is: ${otp}`);

    return { success: true };
  } catch (error) {
    logger.error(MESSAGES.OTP.SEND_ERROR, error);
    return { success: false, error: MESSAGES.OTP.SEND_ERROR };
  }
}

export async function verifyOTP(
  phone: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();
    const cleanPhone = phone.replace(/\D/g, "");

    // Find the most recent unverified OTP for this phone
    const { data: otpRecord, error: fetchError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", cleanPhone)
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
