import Link from "next/link";
import { ArrowLeft, BadgeCheck } from "lucide-react";

import AdminBlogBrandManager from "@/components/admin/AdminBlogBrandManager";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogBrandsPage() {
  const brands = await prisma.blogBrand.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      bio: true,
      avatarUrl: true,
      isActive: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="-ml-2 text-slate-500">
          <Link href="/af-ass-manage/blog">
            <ArrowLeft />
            Back to posts
          </Link>
        </Button>
        <h1 className="mt-4 flex items-center gap-2 text-3xl font-extrabold text-slate-900">
          <BadgeCheck className="size-8 text-purple-600" />
          Blog brands
        </h1>
        <p className="mt-1 text-slate-500">
          Manage the organizations that can publish brand-authored posts.
        </p>
      </div>

      <AdminBlogBrandManager
        brands={brands.map(({ _count: { posts }, ...brand }: any) => ({
          ...brand,
          postCount: posts,
        }))}
      />
    </div>
  );
}
