import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServices } from "@/lib/upstream";

export const maxDuration = 60;

const USD_TO_NGN = 1600;
const MARKUP = 2.5;
const INSERT_BATCH_SIZE = 250;

type UpstreamService = {
  service: string | number;
  name: string;
  type?: string;
  rate: string | number;
  min: string | number;
  max: string | number;
  dripfeed?: boolean;
  refill?: boolean;
  cancel?: boolean;
  category?: string;
};

function chunks<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

function extractPlatform(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("instagram")) return "Instagram";
  if (lower.includes("tiktok")) return "TikTok";
  if (lower.includes("youtube")) return "YouTube";
  if (lower.includes("twitter") || lower.includes(" x ")) return "Twitter";
  if (lower.includes("telegram")) return "Telegram";
  if (lower.includes("facebook")) return "Facebook";
  if (lower.includes("spotify")) return "Spotify";
  if (lower.includes("snapchat")) return "Snapchat";
  if (lower.includes("discord")) return "Discord";
  if (lower.includes("linkedin")) return "LinkedIn";
  if (lower.includes("threads")) return "Threads";
  if (lower.includes("youtube")) return "YouTube";
  if (lower.includes("reddit")) return "Reddit";
  if (lower.includes("twitch")) return "Twitch";
  return "Other";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const peakerServices = await getServices();

    if (!Array.isArray(peakerServices)) {
      console.error("Peakerr response:", peakerServices);
      return NextResponse.json(
        { error: "Invalid response from Peakerr — check your API key" },
        { status: 502 }
      );
    }

    const validServices = (peakerServices as UpstreamService[]).filter((svc) =>
      svc?.service !== undefined && svc?.service !== null &&
      typeof svc.name === "string" && svc.name.length > 0 &&
      Number.isFinite(Number(svc.rate)) && Number.isFinite(Number(svc.min)) &&
      Number.isFinite(Number(svc.max))
    );
    const uniqueServices = Array.from(
      new Map(validServices.map((svc) => [String(svc.service), svc])).values()
    );
    const upstreamIds = uniqueServices.map((svc) => String(svc.service));

    const existingServices = await prisma.service.findMany({
      where: { upstreamId: { in: upstreamIds } },
      select: { upstreamId: true },
    });
    const existingIds = new Set(existingServices.map((svc) => svc.upstreamId));
    const newServices = uniqueServices.filter((svc) => !existingIds.has(String(svc.service)));

    const categoryNames = Array.from(new Set(newServices.map((svc) => svc.category || "General")));
    let categories = await prisma.category.findMany({
      where: { name: { in: categoryNames } },
      select: { id: true, name: true },
    });
    const existingCategoryNames = new Set(categories.map((category) => category.name));
    const missingCategories = categoryNames.filter((name) => !existingCategoryNames.has(name));

    if (missingCategories.length) {
      await prisma.category.createMany({
        data: missingCategories.map((name) => ({
          name,
          platform: extractPlatform(name),
          sortOrder: 0,
        })),
      });
      categories = await prisma.category.findMany({
        where: { name: { in: categoryNames } },
        select: { id: true, name: true },
      });
    }

    const categoryIds = new Map(categories.map((category) => [category.name, category.id]));
    const serviceRows = newServices.flatMap((svc) => {
      const categoryId = categoryIds.get(svc.category || "General");
      if (!categoryId) return [];

      const rateNgn = Math.ceil(Number(svc.rate) * USD_TO_NGN * MARKUP);
      return [{
        categoryId,
        name: svc.name,
        description: `Type: ${svc.type || "Default"}`,
        minOrder: Math.trunc(Number(svc.min)),
        maxOrder: Math.trunc(Number(svc.max)),
        rate: rateNgn,
        upstreamId: String(svc.service),
        refill: svc.refill ?? false,
        cancel: svc.cancel ?? false,
        dripFeed: svc.dripfeed ?? false,
        isActive: true,
      }];
    });

    for (const batch of chunks(serviceRows, INSERT_BATCH_SIZE)) {
      await prisma.service.createMany({ data: batch });
    }

    return NextResponse.json({
      created: serviceRows.length,
      skipped: uniqueServices.length - serviceRows.length,
      invalid: peakerServices.length - validServices.length,
      total: peakerServices.length,
      message: `Sync complete`,
    });
  } catch (error) {
    console.error("Sync error:", error);
    const message = error instanceof Error ? error.message : "Unknown sync error";
    return NextResponse.json({ error: `Sync failed: ${message}` }, { status: 500 });
  }
}
