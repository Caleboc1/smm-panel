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

export async function sendManualTransferReceiptEmail({
  to = process.env.MANUAL_TRANSFER_RECEIPT_EMAIL || SUPPORT_EMAIL,
  customerEmail,
  customerName,
  reference,
  amount,
  senderName,
  note,
  attachment,
}: {
  to?: string;
  customerEmail: string;
  customerName?: string | null;
  reference: string;
  amount: number;
  senderName?: string;
  note?: string;
  attachment: {
    filename: string;
    contentType: string;
    content: Buffer;
  };
}) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`Manual transfer receipt submitted for ${reference} by ${customerEmail}`);
      return;
    }
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport(smtp);
  const rows = [
    ["Customer", customerName ? `${customerName} <${customerEmail}>` : customerEmail],
    ["Amount", `NGN ${amount.toLocaleString("en-NG")}`],
    ["Reference", reference],
    ["Sender name", senderName || "Not provided"],
    ["Note", note || "None"],
  ];

  await transporter.sendMail({
    to,
    from: process.env.SMTP_FROM || `${APP_NAME} Support <${SUPPORT_EMAIL}>`,
    subject: `Manual transfer receipt - ${reference}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Manual transfer receipt</h2>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
          ${rows.map(([label, value]) => `<tr><td style="font-weight:bold">${label}</td><td>${value}</td></tr>`).join("")}
        </table>
        <p>Open the admin manual deposits page to confirm this transfer before crediting the wallet.</p>
      </div>
    `,
    attachments: [{
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    }],
  });
}
