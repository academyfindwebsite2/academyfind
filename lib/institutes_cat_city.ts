import { prisma } from "@/lib/prisma";

export async function getInstitutesByCategoryAndCity(
  categorySlug: string,
  citySlug: string,
  sort?: string
) {
  let orderBy = {};

  switch (sort) {
    case "rating":
      orderBy = {
        averageRating: "desc",
      };
      break;

    case "reviews":
      orderBy = {
        reviewCount: "desc",
      };
      break;

    // Future
    case "fees":
      orderBy = {
        fees: "asc",
      };
      break;

    default:
      orderBy = {
        averageRating: "desc",
      };
  }

  return prisma.institute.findMany({
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

    orderBy,
  });
}