import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing price lists and items first
  await (prisma as any).priceItem.deleteMany({});
  await (prisma as any).priceList.deleteMany({});
  console.log("🧹 Cleared existing price data");

  // Create default price list
  const defaultPriceList = await (prisma as any).priceList.create({
    data: {
      name: "Standard Pricing",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log("✅ Created default price list:", defaultPriceList.id);

  // WASHING Services - exact data from your current price list
  const washingItems = [
    { name: "Blanket", unitPrice: 25.0, taxable: true },
    { name: "Sheet / Fly Sheet", unitPrice: 20.0, taxable: true },
    { name: "Hood or Neck Cover", unitPrice: 15.0, taxable: true },
    { name: "Saddle Pad", unitPrice: 15.0, taxable: true },
    { name: "Wraps / Boots (set of 4)", unitPrice: 20.0, taxable: true },
    { name: "Fleece Girth", unitPrice: 15.0, taxable: true },
  ];

  // ADD-ON Services - exact data from your current price list
  const addOnItems = [
    { name: "Waterproofing", unitPrice: 20.0, taxable: true },
    { name: "Custom Made Tail Strap", unitPrice: 10.0, taxable: true },
    { name: "Custom Made Leg Strap", unitPrice: 15.0, taxable: true },
  ];

  // REPAIRS - exact data from your current price list
  const repairItems = [
    { name: "Repairs (Starting at)", unitPrice: 15.0, taxable: true },
  ];

  // Create washing items
  for (const item of washingItems) {
    await (prisma as any).priceItem.create({
      data: {
        priceListId: defaultPriceList.id,
        name: item.name,
        category: "WASHING",
        unitPrice: item.unitPrice,
        taxable: item.taxable,
        scope: "ITEM",
        active: true,
      },
    });
  }

  // Create add-on items
  for (const item of addOnItems) {
    await (prisma as any).priceItem.create({
      data: {
        priceListId: defaultPriceList.id,
        name: item.name,
        category: "ADD_ON",
        unitPrice: item.unitPrice,
        taxable: item.taxable,
        scope: "ITEM",
        active: true,
      },
    });
  }

  // Create repair items
  for (const item of repairItems) {
    await (prisma as any).priceItem.create({
      data: {
        priceListId: defaultPriceList.id,
        name: item.name,
        category: "REPAIR",
        unitPrice: item.unitPrice,
        taxable: item.taxable,
        scope: "ITEM",
        active: true,
      },
    });
  }

  console.log("✅ Created default price items");

  // Create a default admin user if none exists
  const existingAdmin = await (prisma as any).user.findFirst({
    where: { role: "admin" },
  });

  if (!existingAdmin) {
    const adminUser = await (prisma as any).user.create({
      data: {
        name: "Admin User",
        email: "loveserenespaces@gmail.com",
        role: "admin",
      },
    });
    console.log("✅ Created default admin user:", adminUser.email);
  } else {
    console.log("ℹ️ Admin user already exists:", existingAdmin.email);
  }

  console.log("🎉 Database seed completed successfully!");
  console.log("📋 Your pricing data is now ready in the admin interface!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
