import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServices } from "@/lib/upstream";

const USD_TO_NGN = 1600;
const MARKUP = 2.5;

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

    let created = 0;
    let skipped = 0;

    for (const svc of peakerServices) {
      // Skip if already imported
      const existing = await prisma.service.findFirst({
        where: { upstreamId: String(svc.service) },
      });
      if (existing) { skipped++; continue; }

      // Find or create category
      const catName = svc.category || "General";
      const platform = extractPlatform(catName);

      let category = await prisma.category.findFirst({
        where: { name: catName },
      });

      if (!category) {
        category = await prisma.category.create({
          data: { name: catName, platform, sortOrder: 0 },
        });
      }

      // Calculate your NGN rate with markup
      const peakerRateUSD = parseFloat(svc.rate);
      const peakerRateNGN = peakerRateUSD * USD_TO_NGN;
      const yourRateNGN = Math.ceil(peakerRateNGN * MARKUP);

      await prisma.service.create({
        data: {
          categoryId: category.id,
          name: svc.name,
          description: `Type: ${svc.type}`,
          minOrder: parseInt(svc.min),
          maxOrder: parseInt(svc.max),
          rate: yourRateNGN,
          upstreamId: String(svc.service),
          refill: svc.refill ?? false,
          cancel: svc.cancel ?? false,
          isActive: true,
        },
      });
      created++;
    }

    return NextResponse.json({
      created,
      skipped,
      total: peakerServices.length,
      message: `Sync complete`,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}