import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function toggleBookmark(postId: string) {
  try {
    if (!postId) {
      return {
        success: false,
        error: "Post ID is required.",
      };
    }

    const session = await getCachedSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated.",
      };
    }

    const userId = session.user.id;

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) {
      return {
        success: false,
        error: "Post not found.",
      };
    }

    const existingBookmark = await prisma.blogBookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
        await prisma.$transaction([
            prisma.blogBookmark.delete({
            where: {
                userId_postId: {
                userId,
                postId,
                },
            },
            }),
            prisma.blogPost.update({
            where: { id: postId },
            data: {
                bookmarkCount: {
                decrement: 1,
                },
            },
            }),
        ]);

    return {
        success: true,
        bookmarked: false,
    };
}

    await prisma.$transaction([
    prisma.blogBookmark.create({
        data: {
        userId,
        postId,
        },
    }),
    prisma.blogPost.update({
        where: { id: postId },
        data: {
        bookmarkCount: {
            increment: 1,
        },
        },
    }),
    ]);

    return {
    success: true,
    bookmarked: true,
    };
  } catch (error) {
    console.error("Error toggling bookmark:", error);

    return {
      success: false,
      error: "Failed to toggle bookmark.",
    };
  }
}