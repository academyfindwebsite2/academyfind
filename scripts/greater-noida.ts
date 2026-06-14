import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🔍 Starting database cleanup for Greater Noida...");

  // 1. Pehle Greater Noida city ko database se dhoondho
  const greaterNoidaCity = await prisma.city.findUnique({
    // Make sure aapka slug yahi ho jo aapne DB mein add kiya hai
    where: { slug: "greater-noida" }, 
  });

  if (!greaterNoidaCity) {
    console.error("❌ Greater Noida city nahi mili! Pehle usey admin panel/DB mein add karein.");
    return;
  }

  console.log(`✅ Greater Noida found with ID: ${greaterNoidaCity.id}`);

  // 2. Un saare institutes ko update karo jinke address me "Greater Noida" hai
  // aur jo already Greater Noida me nahi hain
  const updateResult = await prisma.institute.updateMany({
    where: {
      address: {
        contains: "Greater Noida",
        mode: "insensitive", // Case insensitive (GREATER noida, greater noida dono chalega)
      },
      cityId: {
        not: greaterNoidaCity.id, // Jo already shift ho chuke hain unko ignore karo
      },
    },
    data: {
      cityId: greaterNoidaCity.id,
    },
  });

  console.log(`🎉 Success! ${updateResult.count} institutes successfully shifted to Greater Noida.`);
}

main()
  .catch((e) => {
    console.error("Error updating institutes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });