"use server";

import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { syncBlogPostToMeili } from "./meilisync";

export async function addBlogComment(postId: string, content: string) {
  try {
    if (!postId) {
      return { success: false, error: "Post ID is required." };
    }

    const trimmedContent = content?.trim() || "";
    if (trimmedContent.length < 3) {
      return { success: false, error: "Comment must be at least 3 characters long." };
    }
    if (trimmedContent.length > 1000) {
      return { success: false, error: "Comment cannot exceed 1000 characters." };
    }

    const session = await getCachedSession();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to comment." };
    }

    const userId = session.user.id;

    // Sanitize comment for XSS protection
    const sanitizedContent = sanitizeHtml(trimmedContent, {
      allowedTags: [],
      allowedAttributes: {},
    });
    if (!sanitizedContent.trim()) {
      return { success: false, error: "Invalid comment content." };
    }

    // Insert comment and increment comment count inside a transaction
    const [comment] = await prisma.$transaction([
      prisma.blogComment.create({
        data: {
          postId,
          userId,
          content: sanitizedContent,
          status: "APPROVED", // Auto-approved for community engagement
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.blogPost.update({
        where: { id: postId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      }),
    ]);

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { slug: true },
    });

    // Sync comment count to Meilisearch
    await syncBlogPostToMeili(postId);

    // Revalidate paths for instant UI updates
    revalidatePath("/blog");
    revalidatePath("/blog/search");
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return { success: true, comment };
  } catch (error) {
    console.error("Error adding blog comment:", error);
    return { success: false, error: "Failed to add comment. Please try again." };
  }
}
