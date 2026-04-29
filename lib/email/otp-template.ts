export function buildOTPEmailHtml(otp: string, expiresMinutes: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your verification code</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; padding: 24px;">
    <tr>
      <td style="background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
        <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #1a1a1a;">Bloom</h1>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280;">Your verification code for checkout</p>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #374151;">Use this code to verify your email for Cash on Delivery:</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px 24px; text-align: center; margin: 0 0 24px 0;">
          <span style="font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #be123c;">${otp}</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #6b7280;">This code expires in ${expiresMinutes} minutes. If you didn't request it, you can ignore this email.</p>
        <p style="margin: 24px 0 0 0; font-size: 12px; color: #9ca3af;">— Bloom</p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
