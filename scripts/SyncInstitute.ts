import { prisma } from "@/lib/prisma";
import { meili } from "@/lib/meilisearch";
import { revalidatePath } from "next/cache";

export async function syncSingleInstituteToMeili(instituteId: string) {
  try {
    console.log(`Fetching institute data for ID: ${instituteId}...`);

    // 1. Fetch data from DB
    const inst = await prisma.institute.findUnique({
      where: { id: instituteId, isActive: true },
      include: {
        city: true,
        categories: { include: { category: true } },
      },
    });

    const index = meili.index("global_search");
    const documentId = `inst-${instituteId}`;

    // Handle deleted/inactive states safely
    if (!inst) {
      console.log(`Institute not found or inactive. Removing ${documentId} from Meilisearch...`);
      const response = await index.deleteDocument(documentId);
      await meili.tasks.waitForTask(response.taskUid, { timeout: 10000 });
      return { success: true, action: "deleted" };
    }

    // 2. Map payload matching your batch schema
    const documentToSync = {
      id: documentId,
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
      categoryIds: inst.categories.map((c) => c.categoryId),
      subscriptionPlan: inst.subscriptionPlan,
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
      viewCount: inst.viewCount,
      compareCount: inst.compareCount,
      feeMin: inst.feeMin,
      feeMax: inst.feeMax,
      hasOnlineClasses: inst.hasOnlineClasses,
      hasHostelFacility: inst.hasHostelFacility,
      hasDemoClasses: inst.hasDemoClasses,
    };

    // 3. Sync to Meilisearch
    console.log(`Syncing ${documentId} to Meilisearch...`);
    const response = await index.addDocuments([documentToSync]);
    
    await meili.tasks.waitForTask(response.taskUid, { timeout: 15000 });
    console.log(`✅ Successfully synced ${documentId} to Meilisearch!`);

    // 4. Safe Next.js Revalidation Check
    // execution context check taaki CLI script na phate
    if (process.env.NEXT_RUNTIME || typeof window === "undefined" && !process.env.INIT_CWD) {
       try {
           revalidatePath(`/institute/${inst.id}-${inst.slug}`);
           revalidatePath('/af-ass-manage/institutes');
           console.log("⚡ Next.js paths revalidated successfully.");
       } catch (revalidateError) {
           // Fallback catch agar runtime detect na ho paye tab bhi execution na rukey
           console.warn("⚠️ Revalidation skipped: Not running inside a live Next.js app server context.");
       }
    } else {
       console.log("ℹ️ CLI Script Mode: Skipping Next.js cache revalidation.");
    }

    return { success: true, action: "synced" };
  } catch (error) {
    console.error("Single Sync Error:", error);
    return { success: false, error };
  }
}

// Execution block
syncSingleInstituteToMeili("cmr14ojgq000004jsblbwb6nu")
  .then((res) => {
    if (res.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error("Fatal Script Error:", e);
    process.exit(1);
  });
