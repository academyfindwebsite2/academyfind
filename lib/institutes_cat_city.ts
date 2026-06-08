import { prisma } from "@/lib/prisma";
import { meili } from "@/lib/meilisearch";
import { Institute, City, Review } from "@/app/generated/prisma/client";

export type InstituteWithDistance = Institute & {
  city: City;
  reviews: Review[];
  distance?: string | null;
};

export async function getInstitutesByCategoryAndCity(
  categorySlug: string,
  citySlug: string,
  sort?: string,
  page: number = 1,
  q?: string,
  lat?: number, 
  lng?: number, 
  radius?: number,    
  minRating?: number, 
  limit: number = 12
) {
  const skip = (page - 1) * limit;
  // Agar radius select kiya hai, toh usko meters me convert karo, nahi toh 5km default
  const radiusInMeters = radius ? radius * 1000 : 5000; 

  // ==========================================
  // 🚀 SCENARIO 1: MEILISEARCH
  // ==========================================
  if ((q && q.trim() !== "") || (lat && lng)) {
    let exactAreaMatch = true;

    let searchOptions: any = {
      filter: [
        `type = "institute"`,
        `citySlug = "${citySlug}"`,
        `categorySlugs = "${categorySlug}"`
      ],
      limit: limit,
      offset: skip,
    };

    // Rating Filter add kiya
    if (minRating) {
      searchOptions.filter.push(`googleRating >= ${minRating}`);
    }

    // Distance Radius
    if (lat && lng) {
      searchOptions.filter.push(`_geoRadius(${lat}, ${lng}, ${radiusInMeters})`);
    }

    // Smart Sorting Logic
    if (sort === "rating") {
      searchOptions.sort = ["googleRating:desc"];
    } else if (sort === "reviews") {
      searchOptions.sort = ["googleReviewCount:desc"];
    } else if (lat && lng) {
      searchOptions.sort = [`_geoPoint(${lat}, ${lng}):asc`]; // Default distance sort
    }

    const searchQuery = q ? q.trim() : "";
    let searchRes = await meili.index("global_search").search(searchQuery, searchOptions);

    if (searchRes.hits.length === 0) {
      exactAreaMatch = false; 
      
      // Fallback A (Radius hatao, par rating filter rakho)
      searchOptions.filter = [
        `type = "institute"`,
        `citySlug = "${citySlug}"`,
        `categorySlugs = "${categorySlug}"`
      ];
      if (minRating) searchOptions.filter.push(`googleRating >= ${minRating}`);
      
      // Sorting reset
      if (sort === "rating") searchOptions.sort = ["googleRating:desc"];
      else if (sort === "reviews") searchOptions.sort = ["googleReviewCount:desc"];
      else delete searchOptions.sort;

      searchRes = await meili.index("global_search").search(searchQuery, searchOptions);

      if (searchRes.hits.length === 0 && searchQuery !== "") {
         searchRes = await meili.index("global_search").search("", searchOptions);
      }
    }

    const instituteIds = searchRes.hits.map((hit: any) => hit.prismaId);

    if (instituteIds.length === 0) {
      return { institutes: [], totalPages: 0, currentPage: page, totalCount: 0, exactAreaMatch: false };
    }

    const dbInstitutes = await prisma.institute.findMany({
      where: { id: { in: instituteIds } },
      include: { city: true, reviews: true },
    });

    const distanceMap = new Map(
      searchRes.hits.map((hit: any) => [
        hit.prismaId, 
        hit._geoDistance ? (hit._geoDistance / 1000).toFixed(1) : null
      ])
    );

    // Ab institutes ko sort karein aur distance add karein
    const orderedInstitutes = instituteIds.flatMap((id) => {
      const inst = dbInstitutes.find((i) => i.id === id);
      if (!inst) return [];
      
      // Distance inject karein
      return [{
        ...inst,
        distance: distanceMap.get(id) || null
      }];
    });

    return {
      institutes: orderedInstitutes,
      totalPages: Math.ceil((searchRes.estimatedTotalHits || 0) / limit),
      currentPage: page,
      totalCount: searchRes.estimatedTotalHits || 0,
      exactAreaMatch,
    };
  }

  // ==========================================
  // 🏢 SCENARIO 2: PURE PRISMA
  // ==========================================
  let orderBy = {};
  switch (sort) {
    case "rating": orderBy = [{ googleRating: "desc" }, { id: "asc" }]; break;
    case "reviews": orderBy = [{ googleReviewCount: "desc" }, { id: "asc" }]; break;
    default: orderBy = [{ googleRating: "desc" }, { id: "asc" }];
  }

  // Prisma Rating Filter
  const prismaWhere: any = {
    city: { slug: citySlug },
    categories: { some: { category: { slug: categorySlug } } },
  };

  if (minRating) {
    prismaWhere.googleRating = { gte: minRating };
  }

  const [institutes, totalCount] = await Promise.all([
    prisma.institute.findMany({
      where: prismaWhere,
      include: { city: true, reviews: true },
      orderBy,
      skip: skip,
      take: limit,
    }),
    prisma.institute.count({
      where: prismaWhere,
    }),
  ]);

  return {
    institutes,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount,
  };
}