import { prisma } from "@/lib/prisma";

const cities = [
  { name: "Modinagar", slug: "modinagar", state: "Uttar Pradesh" },
  { name: "Gurugram", slug: "gurugram", state: "Haryana"},
  { name: "Sonipat", slug:"sonipat", state: "Haryana"},

];

async function main() {
  for (const city of cities) {
    await prisma.city.upsert({
      where: {
        slug: city.slug,
      },
      update: {},
      create: city,
    });
  }

  const count = await prisma.city.count();

  console.log(`✅ Cities Seeded (${count} cities)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });