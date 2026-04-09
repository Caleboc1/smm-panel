import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const categoryId = searchParams.get("categoryId");

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      ...(categoryId ? { categoryId } : {}),
      ...(platform ? { category: { platform } } : {}),
    },
    include: { category: true },
    orderBy: { category: { sortOrder: "asc" } },
  });
  return NextResponse.json(services);
}
