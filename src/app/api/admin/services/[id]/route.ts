import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string; }> }) {
  const session = await getServerSession(authOptions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; }> }) {
  const session = await getServerSession(authOptions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { id } = await params;
  const service = await prisma.service.update({ where: { id }, data: body });
  return NextResponse.json(service);
}
