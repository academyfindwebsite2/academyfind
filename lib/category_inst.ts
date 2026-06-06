// lib/category.ts file ke andar add karein
import { prisma } from "@/lib/prisma";

export async function getInstitutesByCategory(categorySlug: string,page: number = 1,
  limit: number = 12) {
    const skip = (page - 1) * limit;
  const [institutes,totalCount] =  await prisma.$transaction([
  prisma.institute.findMany({
    where: {
      categories: {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      },
    },
    include: {
      city: true, // City name dikhane ke liye
    },
      skip: skip,   // Page ke hisaab se skip hoga
      take: limit, // Limit laga do taaki page fast load ho (Pagination baad me add kar sakte ho)
    orderBy: [
        { googleRating: 'desc' }, // Top rated pehle
        { id: 'asc' }             // Tie-breaker: Agar rating same hai, toh ID se sort karo
      ],
  }),

  prisma.institute.count({
      where: {
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

  const totalPages = Math.ceil(totalCount / limit);

  return {
    institutes,
    totalPages,
    currentPage: page,
    totalCount, // Total results dikhane ke liye (Optional)
  };
}