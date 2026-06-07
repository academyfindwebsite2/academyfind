import { prisma } from "../lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  console.log("Fetching Noida institutes with Google Image URLs...");

  const institutes = await prisma.institute.findMany({
    where: {
      city: { slug: "noida" },
      imageUrl: { contains: "googleapis.com" },
    },
    select: { id: true, name: true, imageUrl: true },
    // DHYAN DEIN: Test run ke liye sirf 10 items process karne ka limit lagaya hai.
    // Jab ye theek se chal jaye, toh `take: 10` ko comment/remove kar dena.
    take: 500,
  });

  console.log(`Found ${institutes.length} institutes to process.`);

  for (const inst of institutes) {
    if (!inst.imageUrl) continue;

    try {
      console.log(`Uploading image for: ${inst.name}...`);

      const uploadResult = await cloudinary.uploader.upload(inst.imageUrl, {
        folder: "academyfind/institutes",
        public_id: `inst-${inst.id}`,
        overwrite: true,
        format: "webp",
      });

      await prisma.institute.update({
        where: { id: inst.id },
        data: { imageUrl: uploadResult.secure_url },
      });

      console.log(`✅ Success: Updated ${inst.name}`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Failed for ${inst.name}:`, error);
    }
  }

  console.log("🎉 Run complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });