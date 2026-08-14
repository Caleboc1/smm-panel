import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendManualTransferReceiptEmail } from "@/lib/mail";

const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const reference = String(form.get("reference") || "").trim();
    const senderName = String(form.get("senderName") || "").trim();
    const note = String(form.get("note") || "").trim();
    const receipt = form.get("receipt");

    if (!reference) return NextResponse.json({ error: "Payment reference required" }, { status: 400 });
    if (!(receipt instanceof File)) return NextResponse.json({ error: "Receipt file required" }, { status: 400 });
    if (receipt.size > MAX_RECEIPT_SIZE) return NextResponse.json({ error: "Receipt must be 5MB or less" }, { status: 400 });
    if (!ALLOWED_TYPES.has(receipt.type)) {
      return NextResponse.json({ error: "Receipt must be a JPG, PNG, WEBP, or PDF file" }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({
      where: { reference },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    if (!tx || tx.userId !== session.user.id || tx.method !== "manual_transfer") {
      return NextResponse.json({ error: "Manual transfer not found" }, { status: 404 });
    }
    if (tx.status !== "PENDING") {
      return NextResponse.json({ error: "This transfer has already been reviewed" }, { status: 400 });
    }

    const buffer = Buffer.from(await receipt.arrayBuffer());
    await sendManualTransferReceiptEmail({
      customerEmail: tx.user.email,
      customerName: tx.user.name,
      reference,
      amount: tx.amount,
      senderName,
      note,
      attachment: {
        filename: receipt.name || `${reference}-receipt`,
        contentType: receipt.type,
        content: buffer,
      },
    });

    await prisma.transaction.update({
      where: { id: tx.id },
      data: { description: `${tx.description || "Manual transfer pending"} - receipt submitted` },
    });

    return NextResponse.json({ message: "Receipt submitted. Confirmation takes about 5 minutes." });
  } catch (err) {
    console.error("Manual receipt upload error:", err);
    return NextResponse.json({ error: "Unable to submit receipt" }, { status: 500 });
  }
}
