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
  const radiusInMeters = radius ? radius * 1000 : 5000; 

  // ==========================================
  // 🚀 SCENARIO 1: MEILISEARCH
  // ==========================================
  if ((q && q.trim() !== "") || (lat && lng)) {
    let exactAreaMatch = true;

    let searchOptions: any = {
      filter: [
        `type = "institute"`,
        `isActive = true`, // ✅ Meilisearch mein bhi isActive true filter
        `citySlug = "${citySlug}"`,
        `categorySlugs = "${categorySlug}"`
      ],
      limit: limit,
      offset: skip,
    };

    if (minRating) {
      searchOptions.filter.push(`googleRating >= ${minRating}`);
    }

    if (lat && lng) {
      searchOptions.filter.push(`_geoRadius(${lat}, ${lng}, ${radiusInMeters})`);
    }

    if (sort === "rating") {
      searchOptions.sort = ["googleRating:desc"];
    } else if (sort === "reviews") {
      searchOptions.sort = ["googleReviewCount:desc"];
    } else if (lat && lng) {
      searchOptions.sort = [`_geoPoint(${lat}, ${lng}):asc`]; 
    }

    const searchQuery = q ? q.trim() : "";
    let searchRes = await meili.index("global_search").search(searchQuery, searchOptions);

    if (searchRes.hits.length === 0) {
      exactAreaMatch = false; 
      
      // Fallback A (Radius hatao, par isActive rakho)
      searchOptions.filter = [
        `type = "institute"`,
        `isActive = true`, // ✅ Fallback mein bhi isActive check
        `citySlug = "${citySlug}"`,
        `categorySlugs = "${categorySlug}"`
      ];
      if (minRating) searchOptions.filter.push(`googleRating >= ${minRating}`);
      
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
      where: { 
        id: { in: instituteIds },
        isActive: true // ✅ Double security layer DB side par
      },
      include: { city: true, reviews: true },
    });

    const distanceMap = new Map(
      searchRes.hits.map((hit: any) => [
        hit.prismaId, 
        hit._geoDistance ? (hit._geoDistance / 1000).toFixed(1) : null
      ])
    );

    const orderedInstitutes = instituteIds.flatMap((id) => {
      const inst = dbInstitutes.find((i) => i.id === id);
      if (!inst) return [];
      
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
    isActive: true, // ✅ Prisma fallback mein isActive check
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