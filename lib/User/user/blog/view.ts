"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function incrementBlogViewCount(postId: string) {
    try {
        if (!postId) {
            return;
        }

        const cookieStore = await cookies();
        const cookieName = `viewed_post_${postId}`;
        const hasViewed = cookieStore.get(cookieName);

        if (hasViewed) {
            return; // Prevent duplicate counts from rapid refreshes
        }

        // 🚀 PROPER FIX: Use updateMany because 'status' is not unique
        await prisma.blogPost.updateMany({
            where: { id: postId, status: "PUBLISHED" },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });

        // Set viewed cookie with 24 hours expiry
        cookieStore.set(cookieName, "true", {
            maxAge: 60 * 60 * 24, // 24 hours
            httpOnly: true,
            path: "/",
            sameSite: "lax",
        });
    } catch (error) {
        console.error("Error incrementing blog view count:", error);
    }
};
