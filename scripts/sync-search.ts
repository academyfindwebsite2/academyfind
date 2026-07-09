import { prisma } from "@/lib/prisma";
import { meili } from "@/lib/meilisearch";
import dotenv from "dotenv"
import { JobPosting } from "@/app/generated/prisma/client";

dotenv.config()

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
  const blogPosts = await prisma.blogPost.findMany({ 
    where: {
      status: "PUBLISHED",
      visibility: "PUBLIC",
    },
    include: {
      category: true,
      brand: true,
      tags: {
        include:{
          tag: true
        }
      },
      authorProfile: true,

    },
  });

  console.log(`Found: ${institutes.length} Institutes, ${cities.length} Cities, ${categories.length} Categories, ${jobs.length} Jobs,, ${blogPosts.length} Blog Posts`);

  const docs = [
    // --- INSTITUTES ---
    ...institutes.map((inst) => ({
      id: `inst-${inst.id}`,
      prismaId: inst.id,
      type: "institute",
      name: inst.name,
      slug: inst.slug,
      city: inst.city.name,
      cityId: inst.city.id,
      citySlug: inst.city.slug,
      state: inst.city.state,
      description: inst.description ?? "",
      address: inst.address,
      categoryNames: inst.categories.map((c) => c.category.name),
      categorySlugs: inst.categories.map((c) => c.category.slug),
      categoryIds: inst.categories.map((c) => c.categoryId),  // ← ADD THIS
      subscriptionPlan: inst.subscriptionPlan,  // ← ADD THIS
      isPublished: inst.isPublished,
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
      hasDemoClasses: inst.hasDemoClasses,
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

      // --- BLOG POSTS ---
  ...blogPosts.map((post: any) => ({
    id: `blog-${post.id}`,
    prismaId: post.id,

    type: "blog",

    title: post.title,
    name: post.title, 

    slug: post.slug,

    excerpt: post.excerpt ?? "",
    content: stripHtml(post.contentHtml ?? ""),
    categorySlug: post.category?.slug,
    categoryName: post.category?.name,

    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,

    readingTime: post.readingTime,

    publishedAt: post.publishedAt?.getTime(),

    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,

    authorProfile: post.authorProfile
      ? {
          displayName: post.authorProfile.displayName,
          username: post.authorProfile.username,
          avatarUrl: post.authorProfile.avatarUrl,
          isVerified: post.authorProfile.isVerified,
        }
      : null,

      authorUsername: post.authorProfile?.username,

    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
        }
      : null,

    brand: post.brand
      ? {
          id: post.brand.id,
          name: post.brand.name,
          slug: post.brand.slug,
          avatarUrl: post.brand.avatarUrl,
        }
      : null,

    tags: post.tags.map((t: { tag: { name: string } }) => t.tag.name),
    tagSlugs: post.tags.map((t: { tag: { slug: string } }) => t.tag.slug),

    url: `/blog/${post.slug}`,
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
    // We don't wait for the task to finish to avoid timeout crashes on large imports.
    // Meilisearch will process the queue in the background.
  }

  console.log(`\n🎉 ALL DONE! Successfully indexed ${docs.length} documents.`);
}

main()
  .catch((error) => console.error(error))
  .finally(async () => await prisma.$disconnect());