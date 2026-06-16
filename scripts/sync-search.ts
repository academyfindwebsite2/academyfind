import { prisma } from "@/lib/prisma";
import { meili } from "@/lib/meilisearch";
import dotenv from "dotenv"
import { JobPosting } from "@/app/generated/prisma/client";

dotenv.config()

async function main() {
  console.log("Fetching data from database...");

  // 1. Fetch Institutes
  const institutes = await prisma.institute.findMany({
    where: { isActive: true },
    include: {
      city: true,
      categories: { include: { category: true } },
    },
  });

  // 2. Fetch Cities
  const cities = await prisma.city.findMany();

  // 3. Fetch Categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
  });

  // 4. 🚀 NEW: Fetch Job Postings
  const jobs = await prisma.jobPosting.findMany({
    where: { isActive: true },
  });

  console.log(`Found:
  - ${institutes.length} Institutes
  - ${cities.length} Cities
  - ${categories.length} Categories
  - ${jobs.length} Jobs (Careers)`);

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
      mode: inst.mode.toLowerCase()
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

    // --- 🚀 NEW: JOB POSTINGS ---
    ...jobs.map((job: JobPosting) => ({
      id: `job-${job.id}`,
      type: "job",
      name: job.title, // 'title' ko 'name' me map kiya hai taaki search easily dhund le
      slug: job.slug,
      department: job.department,
      location: job.location,
      jobType: job.type,
      description: job.description,
      url: `/careers/${job.slug}`, // Direct job detail page ka URL
    })),
  ];

  const index = meili.index("global_search");

  console.log(`\nSyncing ${docs.length} total documents to Meilisearch...`);

  // 🚀 FIXED: Batching Logic (To prevent 20MB Payload Too Large Error)
  const BATCH_SIZE = 2000; 

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    
    // Chunk add karo
    const response = await index.addDocuments(chunk);
    
    console.log(`✅ Pushed batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} docs) - Task: ${response.taskUid}`);
    
    // Server ko zyada overload hone se bachane ke liye ek task complete hone ka wait karenge
    await meili.tasks.waitForTask(response.taskUid);
  }

  console.log(`\n🎉 ALL DONE! Successfully indexed ${docs.length} documents.`);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });