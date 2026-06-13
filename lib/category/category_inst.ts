import { prisma } from "@/lib/prisma";

export async function getInstitutesByCategory(
  categorySlug: string,
  page: number = 1,
  q?: string, // 👈 1. Naya parameter 'q' add kiya (optional)
  limit: number = 12
) {
  const skip = (page - 1) * limit;

  // 👇 2. Base where clause banaya
  const whereClause: any = {
    isActive: true,
    categories: {
      some: {
        category: {
          slug: categorySlug,
        },
      },
    },
  };

  // 👇 3. Agar 'q' aaya hai (e.g., 'sector 62'), toh search filters add karo
  if (q && q.trim() !== "") {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } }, // Agar DB me address field hai
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [institutes, totalCount] = await prisma.$transaction([
    prisma.institute.findMany({
      where: whereClause,
      include: {
        city: true, 
      },
      skip: skip,
      take: limit,
      orderBy: [
        { googleRating: 'desc' }, 
        { id: 'asc' }
      ],
    }),

    prisma.institute.count({
      where: whereClause, // 👈 Count bhi to updated hona chahiye
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    institutes,
    totalPages,
    currentPage: page,
    totalCount,
  };
}