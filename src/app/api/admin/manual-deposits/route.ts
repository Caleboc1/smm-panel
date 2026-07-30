import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  if ((session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const transactions = await prisma.transaction.findMany({
    where: { method: "manual_transfer" },
    include: { user: { select: { email: true, name: true, balance: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { transactionId, action } = await req.json();
    if (!transactionId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx || tx.method !== "manual_transfer") {
      return NextResponse.json({ error: "Manual deposit not found" }, { status: 404 });
    }
    if (tx.status !== "PENDING") {
      return NextResponse.json({ error: "Deposit has already been reviewed" }, { status: 400 });
    }

    if (action === "reject") {
      const result = await prisma.transaction.updateMany({
        where: { id: transactionId, status: "PENDING" },
        data: { status: "FAILED", description: `${tx.description || "Manual transfer"} - rejected` },
      });
      if (result.count === 0) {
        return NextResponse.json({ error: "Deposit has already been reviewed" }, { status: 400 });
      }
      const rejected = await prisma.transaction.findUnique({ where: { id: transactionId } });
      return NextResponse.json({ transaction: rejected });
    }

    const transaction = await prisma.$transaction(async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      db: any
    ) => {
      const result = await db.transaction.updateMany({
        where: { id: transactionId, status: "PENDING" },
        data: { status: "COMPLETED", description: `${tx.description || "Manual transfer"} - approved` },
      });
      if (result.count === 0) throw new Error("Deposit has already been reviewed");
      await db.user.update({
        where: { id: tx.userId },
        data: { balance: { increment: tx.amount } },
      });
      return db.transaction.findUnique({ where: { id: transactionId } });
    });

    return NextResponse.json({ transaction });
  } catch (err) {
    console.error("Manual deposit review error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
