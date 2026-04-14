import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServices, getBalance } from "@/lib/upstream";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [services, balance] = await Promise.all([
    getServices(),
    getBalance(),
  ]);

  return NextResponse.json({ services, balance });
}