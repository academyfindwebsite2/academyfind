
"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogAuthorProfile, BlogBrand, BlogCategory, BlogPost } from "@/app/generated/prisma/client";

type RelatedPost = Pick<
  BlogPost,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "coverImage"
  | "coverImageAlt"
  | "publishedAt"
  | "readingTime"
> & {
  authorProfile: Pick<BlogAuthorProfile, "displayName" | "username"> | null;
  brand: Pick<BlogBrand, "name"> | null;
  category: Pick<BlogCategory, "name" | "slug"> | null;
};

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Related Articles
          </h2>
          <p className="mt-2 text-slate-600">
            Continue exploring similar topics.
          </p>
        </div>

        <Link
          href="/blog"
          className="text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post: RelatedPost) => (
          <article
            key={post.id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="relative aspect-[16/9] bg-slate-100">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt ?? post.title}
                    fill
                    sizes="(max-width:768px)100vw,(max-width:1280px)50vw,33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
            </Link>

            <div className="p-5">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wide text-amber-600"
                >
                  {post.category.name}
                </Link>
              )}

              <Link href={`/blog/${post.slug}`}>
                <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-amber-600">
                  {post.title}
                </h3>
              </Link>

              {post.excerpt && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                {post.authorProfile ? (
                  <Link
                    href={`/blog/author/${post.authorProfile.username}`}
                    className="hover:text-slate-900"
                  >
                    {post.authorProfile.displayName}
                  </Link>
                ) : (
                  <span>{post.brand?.name ?? "AcademyFind"}</span>
                )}

                <span>
                  {post.readingTime ? `${post.readingTime} min` : ""}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
