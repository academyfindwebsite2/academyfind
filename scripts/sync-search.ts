import { prisma } from "@/lib/prisma";
import { meili } from "@/lib/meilisearch";
import dotenv from "dotenv"

dotenv.config()

async function main() {
  console.log("Fetching data from database...");

  const institutes = await prisma.institute.findMany({
    where: {
      isActive: true,
    },

    include: {
      city: true,

      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  const cities = await prisma.city.findMany();

  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
  });

  const docs = [
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

      categoryNames: inst.categories.map(
        (c) => c.category.name
      ),

      categorySlugs: inst.categories.map(
        (c) => c.category.slug
      ),

      averageRating: inst.averageRating ?? 0,
      reviewCount: inst.reviewCount ?? 0,

      imageUrl: inst.imageUrl ?? "",

      latitude: inst.latitude,
      longitude: inst.longitude,

      url: `/institute/${inst.id}-${inst.slug}`,
    })),

    ...cities.map((city) => ({
      id: `city-${city.id}`,
      type: "city",

      name: city.name,
      slug: city.slug,

      state: city.state,

      url: `/search?q=${encodeURIComponent(city.name)}`,
    })),

    ...categories.map((category) => ({
      id: `cat-${category.id}`,
      type: "category",

      name: category.name,
      slug: category.slug,

      level: category.level,

      url: `/${category.slug}`,
    })),
  ];

  const index = meili.index("global_search");

  console.log("Syncing documents...");

  const response = await index.addDocuments(docs);

  console.log(
    `Documents queued. Task UID: ${response.taskUid}`
  );

  await meili.tasks.waitForTask(response.taskUid);

  console.log(
    `✅ Successfully indexed ${docs.length} documents`
  );
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });