"use client";

import { useEffect } from "react";
import { incrementBlogViewCount } from "@/lib/User/user/blog/view";

interface ViewTrackerProps {
  postId: string;
}

export default function ViewTracker({ postId }: ViewTrackerProps) {
  useEffect(() => {
    if (postId) {
      incrementBlogViewCount(postId).catch((error) => {
        console.error("Failed to track view:", error);
      });
    }
  }, [postId]);

  return null;
}
