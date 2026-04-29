import crypto from "crypto";

const DEFAULT_EXPIRY_DAYS = 14;

function getTrackingSecret() {
  return (
    process.env.ORDER_TRACKING_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
  );
}

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  const secret = getTrackingSecret();
  if (!secret) {
    throw new Error("ORDER_TRACKING_SECRET is not configured");
  }
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createOrderAccessToken(orderId: string, email?: string, phone?: string, expiryDays = DEFAULT_EXPIRY_DAYS) {
  const expiresAt = Date.now() + expiryDays * 24 * 60 * 60 * 1000;
  const payloadObj = {
    orderId,
    email: (email || "").trim().toLowerCase(),
    phone: (phone || "").trim(),
    exp: expiresAt,
  };
  const payload = base64UrlEncode(JSON.stringify(payloadObj));
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyOrderAccessToken(
  token: string,
  orderId: string,
  email?: string,
  phone?: string
) {
  if (!token || !orderId) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = signPayload(payload);
  if (signature.length !== expectedSignature.length) {
    return false;
  }
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false;
  }

  const decoded = JSON.parse(base64UrlDecode(payload)) as {
    orderId: string;
    email?: string;
    phone?: string;
    exp: number;
  };

  if (decoded.orderId !== orderId) return false;
  if (!decoded.exp || decoded.exp < Date.now()) return false;

  const normalizedEmail = (email || "").trim().toLowerCase();
  const normalizedPhone = (phone || "").trim();
  const tokenEmail = (decoded.email || "").trim().toLowerCase();
  const tokenPhone = (decoded.phone || "").trim();

  if (normalizedEmail && tokenEmail && normalizedEmail === tokenEmail) return true;
  if (normalizedPhone && tokenPhone && normalizedPhone === tokenPhone) return true;
  return false;
}
