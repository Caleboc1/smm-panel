import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { PlatformsSection } from "@/components/landing/PlatformsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ServicesPreview } from "@/components/landing/ServicesPreview";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const revalidate = 60;

async function getStats() {
  const [totalOrders, totalUsers] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
  ]).catch(() => [72100000, 18400]);
  return { totalOrders, totalUsers };
}

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    include: { category: true },
    take: 10,
    orderBy: { createdAt: "desc" },
  }).catch(() => []);
}

export default async function HomePage() {
  const [stats, services] = await Promise.all([getStats(), getServices()]);
  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <StatsBar stats={stats} />
      <PlatformsSection />
      <FeaturesSection />
      <ServicesPreview services={services} />
      <LandingFooter />
    </main>
  );
}
