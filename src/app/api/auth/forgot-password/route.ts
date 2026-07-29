import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const SUCCESS_MESSAGE = "If that email exists, a password reset link has been sent.";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash, expiresAt },
      }),
    ]);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const resetUrl = new URL(`/reset-password?token=${token}`, appUrl).toString();
    await sendPasswordResetEmail(normalizedEmail, resetUrl);

    return NextResponse.json({
      message: SUCCESS_MESSAGE,
      resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Unable to send reset link" }, { status: 500 });
  }
}
