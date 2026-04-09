import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcCharge } from "@/lib/utils";
import { createOrder as upstreamCreateOrder } from "@/lib/upstream";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { service: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { serviceId, link, quantity, customComment } = await req.json();
    if (!serviceId || !link || !quantity)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const service = await prisma.service.findUnique({ where: { id: serviceId, isActive: true } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    if (quantity < service.minOrder || quantity > service.maxOrder)
      return NextResponse.json({ error: `Quantity must be between ${service.minOrder} and ${service.maxOrder}` }, { status: 400 });

    const charge = calcCharge(service.rate, quantity);
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.balance < charge)
      return NextResponse.json({ error: "Insufficient balance" }, { status: 402 });

    // Deduct balance & create order atomically
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: { userId: session.user.id, serviceId, link, quantity, charge, customComment, status: "PENDING" },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: charge } },
      }),
      prisma.transaction.create({
        data: { userId: session.user.id, amount: charge, type: "DEBIT", description: `Order for: ${service.name}`, status: "COMPLETED" },
      }),
    ]);

    // Send to upstream if configured
    if (service.upstreamId) {
      try {
        const upstream = await upstreamCreateOrder(service.upstreamId, link, quantity, customComment);
        if (upstream.order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { upstreamOrderId: String(upstream.order), status: "PROCESSING" },
          });
        }
      } catch {
        // upstream failed - mark for manual processing
        await prisma.order.update({ where: { id: order.id }, data: { status: "PENDING" } });
      }
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
