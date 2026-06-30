import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Breadcrumb from "@/components/blog/article/BreadCrumb";
import NewsletterCTA from "@/components/blog/article/NewsLetterCTA";

import MyPostsHero from "@/components/blog/my-posts/MyPostsHero";
import MyPostsStats from "@/components/blog/my-posts/MyPostsStats";
import MyPostsFilters from "@/components/blog/my-posts/MyPostsFilters";
import MyPostsGrid from "@/components/blog/my-posts/MyPostsGrid";
import MyPostsEmptyState from "@/components/blog/my-posts/MyPostsEmptyState";
import Pagination from "@/components/blog/shared/Pagination";
import { getCachedSession } from "@/lib/auth/session";
import { getMyPosts } from "@/lib/User/user/blog/getmyposts";

import { BlogStatus } from "@/app/generated/prisma/enums";

export const metadata: Metadata = {
  title: "My Posts | AcademyFind Blog",
  description:
    "Manage your blog posts, drafts, scheduled articles and published content.",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{
    page?: string;
    status?: BlogStatus;
  }>;
};

export default async function MyPostsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const page = Number(params.page ?? "1");

  const data = await getMyPosts({
    userId: session.user.id,
    page,
    limit: 8,
    status: params.status,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          {
            label: "Blog",
            href: "/blog",
          },
          {
            label: "My Posts",
          },
        ]}
      />

      <MyPostsHero totalPosts={data.total} />

      <div className="mt-10">
        <MyPostsStats
          draft={data.stats.draft}
          pendingReview={data.stats.pendingReview}
          scheduled={data.stats.scheduled}
          published={data.stats.published}
          rejected={data.stats.rejected}
          archived={data.stats.archived}
        />
      </div>

      <div className="mt-10">
        <MyPostsFilters />
      </div>

      <section className="mt-10">
        {data.posts.length > 0 ? (
          <>
            <MyPostsGrid posts={data.posts} />

            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
            />
          </>
        ) : (
          <MyPostsEmptyState />
        )}
      </section>

      <div className="mt-20">
        <NewsletterCTA />
      </div>
    </div>
  );
}