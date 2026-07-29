import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    const resetToken = String(token || "");
    const newPassword = String(password || "");

    if (!resetToken) {
      return NextResponse.json({ error: "Reset token required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const tokenHash = hashToken(resetToken);
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    const now = new Date();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: now },
      }),
      prisma.session.deleteMany({ where: { userId: record.userId } }),
    ]);

    return NextResponse.json({ message: "Password updated. You can now sign in." });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Unable to reset password" }, { status: 500 });
  }
}
