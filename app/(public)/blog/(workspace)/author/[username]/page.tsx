import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumb from "@/components/blog/article/BreadCrumb";
import NewsletterCTA from "@/components/blog/article/NewsLetterCTA";

import AuthorHero from "@/components/blog/author/AuthorHero";
import AuthorStats from "@/components/blog/author/AuthorStats";
import AuthorSocials from "@/components/blog/author/AuthorSocials";
import AuthorPostGrid from "@/components/blog/author/AuthorPosts";
import AuthorEmptyState from "@/components/blog/author/AuthorEmptyState";
import AuthorJsonLd from "@/components/blog/author/AuthorJSONLd";

import { getAuthorByUsername } from "@/lib/User/user/blog/getauthor";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { username } = await params;

  const author = await getAuthorByUsername(username);

  if (!author) {
    return {
      title: "Author Not Found | AcademyFind",
      description: "The requested author could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const title =
    author.metaTitle ??
    `${author.displayName} | AcademyFind Blog`;

  const description =
    author.metaDescription ??
    author.bio ??
    `Read articles written by ${author.displayName} on AcademyFind.`;

  const canonical = `${siteUrl}/blog/author/${author.username}`;

  return {
    title,
    description,

    authors: [
      {
        name: author.displayName,
      },
    ],

    keywords: [
      author.displayName,
      author.specialization ?? "",
      "AcademyFind",
      "AcademyFind Blog",
      "Author",
    ].filter(Boolean),

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonical,
      type: "profile",
      siteName: "AcademyFind",
      locale: "en_IN",

      images: author.avatarUrl
        ? [
            {
              url: author.avatarUrl,
              width: 1200,
              height: 630,
              alt: author.displayName,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: author.avatarUrl
        ? [author.avatarUrl]
        : [],
    },
  };
}

export default async function AuthorPage({
  params,
}: Props) {
  const { username } = await params;

  const author = await getAuthorByUsername(username);

  if (!author) {
    notFound();
  }

  return (
    <>
      <AuthorJsonLd author={author} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            {
              label: "Blog",
              href: "/blog",
            },
            {
              label: author.displayName,
            },
          ]}
        />

        <AuthorHero author={author} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <AuthorStats
              totalPosts={author.totalPosts}
              totalViews={author.totalViews}
              totalLikes={author.totalLikes}
              totalComments={author.totalComments}
              followerCount={author.followerCount}
              joinedAt={author.createdAt}
            />

            <AuthorSocials
              websiteUrl={author.websiteUrl}
              twitterUrl={author.twitterUrl}
              linkedinUrl={author.linkedinUrl}
            />
          </aside>

          <main>
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Articles
              </h2>

              <p className="mt-2 text-slate-600">
                {author.totalPosts} published article
                {author.totalPosts !== 1 && "s"}
              </p>
            </div>

            {author.posts.length > 0 ? (
              <AuthorPostGrid posts={author.posts} />
            ) : (
              <AuthorEmptyState />
            )}
          </main>
        </div>

        <div className="mt-20">
          <NewsletterCTA />
        </div>
      </div>
    </>
  );
}