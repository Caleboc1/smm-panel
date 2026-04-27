import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPass = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@yourpanel.com" },
    update: {},
    create: { email: "admin@yourpanel.com", password: adminPass, name: "Admin", role: "ADMIN" },
  });
  // console.log("✓ Admin:", admin.email);

  // Categories
  const categoryData = [
    { name: "Instagram Followers", platform: "Instagram", sortOrder: 1 },
    { name: "Instagram Likes", platform: "Instagram", sortOrder: 2 },
    { name: "Instagram Views & Reels", platform: "Instagram", sortOrder: 3 },
    { name: "TikTok Followers", platform: "TikTok", sortOrder: 4 },
    { name: "TikTok Likes", platform: "TikTok", sortOrder: 5 },
    { name: "TikTok Views", platform: "TikTok", sortOrder: 6 },
    { name: "YouTube Subscribers", platform: "YouTube", sortOrder: 7 },
    { name: "YouTube Views", platform: "YouTube", sortOrder: 8 },
    { name: "Twitter/X Services", platform: "Twitter", sortOrder: 9 },
    { name: "Telegram Members", platform: "Telegram", sortOrder: 10 },
    { name: "Facebook Services", platform: "Facebook", sortOrder: 11 },
    { name: "Spotify Services", platform: "Spotify", sortOrder: 12 },
  ];

  for (const catDef of categoryData) {
    const existing = await prisma.category.findFirst({ where: { name: catDef.name, platform: catDef.platform } });
    const cat = existing ?? await prisma.category.create({ data: catDef });

    // Sample services per category
    const svcCount = await prisma.service.count({ where: { categoryId: cat.id } });
    if (svcCount === 0) {
      await prisma.service.createMany({
        data: [
          {
            categoryId: cat.id,
            name: `${catDef.platform} ${catDef.name.replace(catDef.platform,"").trim()} | Basic | Low Drop | Refill 30D`,
            description: `Good quality service. Instant start, 30-day refill guarantee. Worldwide profiles.`,
            minOrder: 100, maxOrder: 100000,
            rate: 800 + Math.floor(Math.random() * 1200),
            refill: true, cancel: false, isActive: true,
          },
          {
            categoryId: cat.id,
            name: `${catDef.platform} ${catDef.name.replace(catDef.platform,"").trim()} | Premium | Non Drop | Lifetime Refill`,
            description: `Premium quality, non-drop service. Lifetime refill guarantee. Best for long-term growth.`,
            minOrder: 50, maxOrder: 500000,
            rate: 2000 + Math.floor(Math.random() * 2000),
            refill: true, cancel: true, isActive: true,
          },
          {
            categoryId: cat.id,
            name: `🇳🇬 ${catDef.platform} ${catDef.name.replace(catDef.platform,"").trim()} | Nigeria | Real Profiles`,
            description: `100% Nigerian profiles. Ideal for Nigerian creators and brands targeting local audience.`,
            minOrder: 50, maxOrder: 50000,
            rate: 5000 + Math.floor(Math.random() * 5000),
            refill: false, cancel: false, isActive: true,
          },
        ],
      });
      // console.log(`  ✓ Services created for: ${catDef.name}`);
    }
  }
  // console.log("\n✅ Seed complete!");
  // console.log("   Admin login: admin@yourpanel.com / admin123");
  // console.log("   ⚠️  Change the admin password immediately after first login!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
