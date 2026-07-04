import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🔍 Starting database cleanup for Greater Noida...");

  // 1. Pehle Greater Noida city ko database se dhoondho
  const ghaziabadCity = await prisma.city.findUnique({
    // Make sure aapka slug yahi ho jo aapne DB mein add kiya hai
    where: { slug: "ghaziabad" }, 
  });

  if (!ghaziabadCity) {
    console.error("❌ Ghaziabad city nahi mili! Pehle usey admin panel/DB mein add karein.");
    return;
  }

  console.log(`✅ Ghaziabad found with ID: ${ghaziabadCity.id}`);

  // 2. Un saare institutes ko update karo jinke address me "Delhi" hai
  // aur jo already Delhi me nahi hain
  const updateResult = await prisma.institute.updateMany({
    where: {
      address: {
        contains: "ghaziabad",
        mode: "insensitive", // Case insensitive (GREATER noida, greater noida dono chalega)
      },
      cityId: {
        not: ghaziabadCity.id, // Jo already shift ho chuke hain unko ignore karo
      },
    },
    data: {
      cityId: ghaziabadCity.id,
    },
  });

  console.log(`🎉 Success! ${updateResult.count} institutes successfully shifted to Ghaziabad.`);
}

main()
  .catch((e) => {
    console.error("Error updating institutes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });