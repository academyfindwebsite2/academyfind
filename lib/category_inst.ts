// lib/category.ts file ke andar add karein
import { prisma } from "@/lib/prisma";

export async function getInstitutesByCategory(categorySlug: string) {
  return await prisma.institute.findMany({
    where: {
      isActive: true,
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
    take: 20, // Limit laga do taaki page fast load ho (Pagination baad me add kar sakte ho)
    orderBy: {
      googleRating: 'desc', // Top rated pehle dikhane ke liye
    }
  });
}