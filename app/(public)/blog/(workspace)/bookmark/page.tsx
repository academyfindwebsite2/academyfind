// app/blog/bookmark/page.tsx

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Breadcrumb from "@/components/blog/article/BreadCrumb";
import NewsletterCTA from "@/components/blog/article/NewsLetterCTA";

import BookmarkHero from "@/components/blog/bookmark/BookmarkHero";
import BookmarkStats from "@/components/blog/bookmark/BookmarkStats";
import BookmarkFilters from "@/components/blog/bookmark/BookmarkFilters";
import BookmarkGrid from "@/components/blog/bookmark/BookmarkGrid";
import BookmarkEmptyState from "@/components/blog/bookmark/BookmarkEmptyState";

import Pagination from "@/components/blog/shared/Pagination";

import { getCachedSession } from "@/lib/auth/session";
import { getBookmarkedPosts } from "@/lib/User/user/blog/getbookmark";
import { getSearchFilters } from "@/lib/User/user/blog/search";

export const metadata: Metadata = {
  title: "My Bookmarks | AcademyFind Blog",
  description:
    "View and manage your bookmarked AcademyFind blog articles.",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    sort?: "saved" | "latest" | "popular" | "liked" | "comments";
  }>;
};

export default async function BookmarkPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const page = Number(params.page ?? "1");

  const [data, filters] = await Promise.all([
    getBookmarkedPosts({
      userId: session.user.id,
      page,
      limit: 9,
    }),
    getSearchFilters(),
  ]);

  const totalViews = data.posts.reduce(
    (sum: number, post: { viewCount: number }) => sum + post.viewCount,
    0
  );

  const totalLikes = data.posts.reduce(
    (sum: number, post: { likeCount: number }) => sum + post.likeCount,
    0
  );

  const totalCategories = new Set(
    data.posts
      .map((post: { category?: { id?: string } }) => post.category?.id)
      .filter(Boolean)
  ).size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          {
            label: "Blog",
            href: "/blog",
          },
          {
            label: "Bookmarks",
          },
        ]}
      />

      <BookmarkHero
        totalBookmarks={data.total}
      />

      <div className="mt-10">
        <BookmarkStats
          totalBookmarks={data.total}
          totalViews={totalViews}
          totalLikes={totalLikes}
          totalCategories={totalCategories}
        />
      </div>

      <div className="mt-10">
        <BookmarkFilters
          categories={filters.categories}
        />
      </div>

      <section className="mt-10">
        {data.posts.length > 0 ? (
          <>
            <BookmarkGrid
              posts={data.posts}
            />

            <div className="mt-12">
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
              />
            </div>
          </>
        ) : (
          <BookmarkEmptyState />
        )}
      </section>

      <div className="mt-20">
        <NewsletterCTA />
      </div>
    </div>
  );
}