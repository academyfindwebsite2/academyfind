import { prisma } from "@/lib/prisma";
import { meili } from "@/lib/meilisearch";
import dotenv from "dotenv"
import { JobPosting } from "@/app/generated/prisma/client";

dotenv.config()

async function main() {
  console.log("Fetching data from database...");

  const institutes = await prisma.institute.findMany({
    where: { isActive: true },
    include: {
      city: true,
      categories: { include: { category: true } },
    },
  });

  const cities = await prisma.city.findMany();
  const categories = await prisma.category.findMany({ where: { isActive: true } });
  const jobs = await prisma.jobPosting.findMany({ where: { isActive: true } });

  console.log(`Found: ${institutes.length} Institutes, ${cities.length} Cities, ${categories.length} Categories, ${jobs.length} Jobs`);

  const docs = [
    // --- INSTITUTES ---
    ...institutes.map((inst) => ({
      id: `inst-${inst.id}`,
      prismaId: inst.id,
      type: "institute",
      name: inst.name,
      slug: inst.slug,
      city: inst.city.name,
      citySlug: inst.city.slug,
      state: inst.city.state,
      description: inst.description ?? "",
      address: inst.address,
      categoryNames: inst.categories.map((c) => c.category.name),
      categorySlugs: inst.categories.map((c) => c.category.slug),
      averageRating: inst.averageRating ?? 0,
      reviewCount: inst.reviewCount ?? 0,
      googleRating: inst.googleRating,             
      googleReviewCount: inst.googleReviewCount,
      isActive: inst.isActive,
      imageUrl: inst.imageUrl ?? "",
      _geo: inst.latitude && inst.longitude ? {
        lat: parseFloat(inst.latitude.toString()),
        lng: parseFloat(inst.longitude.toString())
      } : undefined,
      url: `/institute/${inst.id}-${inst.slug}`,
      mode: inst.mode.toLowerCase(),

      // 🚀 NEW FIELDS ADDED HERE FOR SEARCH & FILTERS
      viewCount: inst.viewCount,
      compareCount: inst.compareCount,
      feeMin: inst.feeMin,
      feeMax: inst.feeMax,
      hasOnlineClasses: inst.hasOnlineClasses,
      hasHostelFacility: inst.hasHostelFacility,
      hasDemoClasses: inst.hasDemoClasses
    })),

    // --- CITIES ---
    ...cities.map((city) => ({
      id: `city-${city.id}`,
      type: "city",
      name: city.name,
      slug: city.slug,
      state: city.state,
      url: `/search?q=${encodeURIComponent(city.name)}`,
    })),

    // --- CATEGORIES ---
    ...categories.map((category) => ({
      id: `cat-${category.id}`,
      type: "category",
      name: category.name,
      slug: category.slug,
      level: category.level,
      url: `/${category.slug}`,
    })),

    // --- JOB POSTINGS ---
    ...jobs.map((job: JobPosting) => ({
      id: `job-${job.id}`,
      type: "job",
      name: job.title,
      slug: job.slug,
      department: job.department,
      location: job.location,
      jobType: job.type,
      description: job.description,
      url: `/careers/${job.slug}`,
    })),
  ];

  await meili.createIndex("global_search", { primaryKey: "id" });
  const index = meili.index("global_search");

  console.log(`\nSyncing ${docs.length} total documents to Meilisearch...`);

  const BATCH_SIZE = 2000; 
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    const response = await index.addDocuments(chunk);
    console.log(`✅ Pushed batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} docs) - Task: ${response.taskUid}`);
    await meili.tasks.waitForTask(response.taskUid,{ timeout: 100000 });
  }

  console.log(`\n🎉 ALL DONE! Successfully indexed ${docs.length} documents.`);
}

main()
  .catch((error) => console.error(error))
  .finally(async () => await prisma.$disconnect());