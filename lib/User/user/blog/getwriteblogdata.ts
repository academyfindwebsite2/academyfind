import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getWriteBlogData() {
  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const author = await prisma.blogAuthorProfile.findUnique({
    where: {
      userId: session.user.id,
    },

    include: {
      user: true,
    },
  });

  const [categories, tags, brands] = await Promise.all([
    prisma.blogCategory.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    }),

    prisma.blogTag.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    prisma.blogBrand.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        avatarUrl: true,
      },
    }),
  ]);

  return {
    author,
    categories,
    tags,
    brands,
  };
}