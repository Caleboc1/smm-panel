import nodemailer from "nodemailer";

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "calsmm@kmail.li";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "CalebSmm";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`Password reset link for ${email}: ${resetUrl}`);
      return;
    }
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport(smtp);

  await transporter.sendMail({
    to: email,
    from: process.env.SMTP_FROM || `${APP_NAME} Support <${SUPPORT_EMAIL}>`,
    subject: `Reset your ${APP_NAME} password`,
    text: [
      `We received a request to reset your ${APP_NAME} password.`,
      "",
      `Use this link to set a new password: ${resetUrl}`,
      "",
      "This link expires in 1 hour. If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <p>We received a request to reset your ${APP_NAME} password.</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Reset password</a></p>
        <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}
