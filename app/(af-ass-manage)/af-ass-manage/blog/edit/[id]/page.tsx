import type { Metadata } from "next";

import BlogEditor from "@/components/blog/editor/BlogEditor";
import { getAdminBlogPost } from "@/lib/User/admin/admin-blog-data";

export const metadata: Metadata = {
  title: "Edit Blog Post | AcademyFind Admin",
  robots: { index: false, follow: false },
};

type AdminEditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBlogPage({
  params,
}: AdminEditBlogPageProps) {
  const { id } = await params;
  const initialData = await getAdminBlogPost(id);

  return (
    <BlogEditor
      mode="edit"
      management="admin"
      initialData={initialData}
    />
  );
}
