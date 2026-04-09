import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user && (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status");
  const limit = 50;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status: status as any } : {},
      include: { user: { select: { email: true, name: true } }, service: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: status ? { status: status as any } : {} }),
  ]);
  return NextResponse.json({ orders, total });
}
