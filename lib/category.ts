import { prisma } from "@/lib/prisma";

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: {
      slug,
    },
  });
}

export async function getCitiesForCategory(categorySlug: string) {
  return prisma.city.findMany({
    where: {
      institutes: {
        some: {
          categories: {
            some: {
              category: {
                slug: categorySlug,
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getFeaturedInstitutesForCategory(
  categorySlug: string
) {
  return prisma.institute.findMany({
    where: {
      categories: {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      },
    },
    take: 10,
    include: {
      city: true,
      reviews: true,
    },
  });
}