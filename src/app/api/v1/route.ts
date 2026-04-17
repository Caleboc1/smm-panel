import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcCharge } from "@/lib/utils";

async function getUser(key: string) {
  return prisma.user.findUnique({ where: { apiKey: key } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, action } = body;
    if (!key) return NextResponse.json({ error: "API key required" }, { status: 401 });
    const user = await getUser(key);
    if (!user) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    switch (action) {
      case "services": {
        const services = await prisma.service.findMany({
          where: { isActive: true },
          include: { category: true },
          orderBy: { id: "asc" },
        });
        return NextResponse.json(services.map((s: { id: number; name: string; category: { name: string }; type: string; rate: number; minOrder: number; maxOrder: number; refill: boolean; cancel: boolean }) => ({
          service: s.id, name: s.name, category: s.category.name,
          type: s.type, rate: s.rate, min: s.minOrder, max: s.maxOrder,
          refill: s.refill, cancel: s.cancel,
        })));
      }
      case "add": {
        const { service: serviceId, link, quantity } = body;
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return NextResponse.json({ error: "Invalid service" }, { status: 404 });
        const charge = calcCharge(service.rate, parseInt(quantity));
        if (user.balance < charge) return NextResponse.json({ error: "Insufficient funds" }, { status: 402 });
        const [order] = await prisma.$transaction([
          prisma.order.create({ data: { userId: user.id, serviceId, link, quantity: parseInt(quantity), charge, status: "PENDING" } }),
          prisma.user.update({ where: { id: user.id }, data: { balance: { decrement: charge } } }),
        ]);
        return NextResponse.json({ order: order.id });
      }
      case "status": {
        const order = await prisma.order.findUnique({ where: { id: body.order, userId: user.id } });
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        return NextResponse.json({ order: order.id, status: order.status, remains: order.remains, start_count: order.startCount });
      }
      case "balance": {
        return NextResponse.json({ balance: user.balance, currency: "NGN" });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
