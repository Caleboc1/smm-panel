import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MANUAL_PAYMENT = {
  bankName: "Kuda Bank",
  accountNumber: "2003433441",
  accountName: process.env.MANUAL_TRANSFER_ACCOUNT_NAME || "Caleb Ogeneochuko",
  confirmationTime: "5 minutes",
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { amount, senderName } = await req.json();
    const parsedAmount = Number(amount);
    const normalizedSenderName = String(senderName || "").trim();
    if (!Number.isFinite(parsedAmount) || parsedAmount < 100) return NextResponse.json({ error: "Minimum deposit is ₦100" }, { status: 400 });
    if (normalizedSenderName.length < 2 || normalizedSenderName.length > 100) {
      return NextResponse.json({ error: "Enter the name on the account used to send the transfer" }, { status: 400 });
    }

    const reference = `SMM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    await prisma.transaction.create({
      data: {
        userId: session.user.id, amount: parsedAmount, type: "CREDIT",
        method: "manual_transfer", reference, status: "PENDING",
        description: `Manual transfer from ${normalizedSenderName}`,
      },
    });

    return NextResponse.json({ reference, senderName: normalizedSenderName, payment: MANUAL_PAYMENT });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
