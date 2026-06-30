"use client";

import { useState } from "react";
import BlogCard from "@/components/blog/cards/BlogCard";
import { toggleBookmark } from "@/lib/User/user/blog/togglebookmark";
import { BlogCardPost } from "@/types/BlogCard";
import { Bookmark } from "lucide-react"; 

type ExtendedBlogCardPost = BlogCardPost & {
  isBookmarked?: boolean; 
};

type BookmarkGridProps = {
  posts: ExtendedBlogCardPost[];
};

export default function BookmarkGrid({ posts: initialPosts }: BookmarkGridProps) {
  // Store posts in local state to trigger UI re-renders on toggle
  const [posts, setPosts] = useState(initialPosts);

  const handleToggleBookmark = async (postId: string) => {
    setPosts((prevPosts: ExtendedBlogCardPost[]) =>
      prevPosts.map((post: ExtendedBlogCardPost) =>
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      )
    );

    const result = await toggleBookmark(postId);

    if (!result.success) {
      setPosts((prevPosts: ExtendedBlogCardPost[]) =>
        prevPosts.map((post: ExtendedBlogCardPost) =>
          post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
        )
      );
      alert(result.error || "Failed to update bookmark.");
    }
  };

  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post: ExtendedBlogCardPost) => {
        const isBookmarked = post.isBookmarked ?? true;

        return (
          <div key={post.id} className="group relative">
            <BlogCard post={post} />

            <button
              type="button"
              aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              onClick={() => handleToggleBookmark(post.id)}
              className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition
                ${
                  isBookmarked
                    ? "text-amber-500 hover:bg-amber-50"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900" 
                }`}
            >
              <Bookmark
                className="h-5 w-5"
                fill={isBookmarked ? "currentColor" : "none"} 
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
