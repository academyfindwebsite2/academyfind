import { prisma } from "@/lib/prisma";

export async function getInstitutesByCategoryAndCity(
  categorySlug: string,
  citySlug: string,
  sort?: string,
  page: number = 1,
  limit: number = 12
) {
  let orderBy = {};

  // 1. Sort Logic
  switch (sort) {
    case "rating":
      orderBy = [
        { googleRating: "desc" },
        { id: "asc" } // 👈 TIE-BREAKER: Agar rating same hai, to ID ke hisaab se sort karo
      ];
      break;

    case "reviews":
      orderBy = [
        { googleReviewCount: "desc" },
        { id: "asc" } // 👈 TIE-BREAKER
      ];
      break;

    default:
      orderBy = [
        { googleRating: "desc" },
        { id: "asc" } // 👈 TIE-BREAKER
      ];
  }

  // 2. Pagination Math
  const skip = (page - 1) * limit;

  // 3. Prisma Transaction (Data + Total Count parallel aayega)
  const [institutes, totalCount] = await prisma.$transaction([
    prisma.institute.findMany({
      where: {
        city: {
          slug: citySlug,
        },
        categories: {
          some: {
            category: {
              slug: categorySlug,
            },
          },
        },
      },
      include: {
        city: true,
        reviews: true,
      },
      orderBy,      // Sort apply ho gaya
      skip: skip,   // Page ke hisaab se skip hoga
      take: limit,  // 12 records aayenge per page
    }),

    // Total Count ki alag query (Pagination UI ke liye zaroori hai)
    prisma.institute.count({
      where: {
        city: {
          slug: citySlug,
        },
        categories: {
          some: {
            category: {
              slug: categorySlug,
            },
          },
        },
      },
    }),
  ]);

  // 4. Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  return {
    institutes,
    totalPages,
    currentPage: page,
    totalCount, // Total results dikhane ke liye (Optional)
  };
}