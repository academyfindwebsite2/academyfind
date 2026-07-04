import type { Metadata } from "next";

import BlogEditor from "@/components/blog/editor/BlogEditor";

export const metadata: Metadata = {
  title: "New Brand Post | AcademyFind Admin",
  robots: { index: false, follow: false },
};

export default function NewAdminBlogPostPage() {
  return <BlogEditor mode="create" management="admin" />;
}
