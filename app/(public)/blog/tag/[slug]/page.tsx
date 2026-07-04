import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumb from "@/components/blog/article/BreadCrumb";
import NewsletterCTA from "@/components/blog/article/NewsLetterCTA";

import TagHero from "@/components/blog/tag/TagHero";
import TagPostGrid from "@/components/blog/tag/TagPostGrid";
import TagEmptyState from "@/components/blog/tag/TagEmptyState";
import TagJsonLd from "@/components/blog/tag/TagJsonLd";

import { getTagBySlug } from "@/lib/User/user/blog/gettag";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag Not Found | AcademyFind",
      description: "The requested tag could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const title = `${tag.name} Articles | AcademyFind Blog`;

  const description = `Explore all blog articles tagged with ${tag.name} on AcademyFind.`;

  const canonical = `${siteUrl}/blog/tag/${tag.slug}`;

  return {
    title,
    description,

    keywords: [
      tag.name,
      "AcademyFind",
      "AcademyFind Blog",
      "Blog Tag",
    ],

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
      type: "website",
      siteName: "AcademyFind",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TagPage({
  params,
}: Props) {
  const { slug } = await params;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  return (
    <>
      <TagJsonLd tag={tag} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            {
              label: "Blog",
              href: "/blog",
            },
            {
              label: `#${tag.name}`,
            },
          ]}
        />

        <TagHero tag={tag} />

        <section className="mt-14">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Tagged Articles
            </h2>

            <p className="mt-2 text-slate-600">
              {tag.postCount} published article
              {tag.postCount !== 1 && "s"}
            </p>
          </div>

          {tag.posts.length > 0 ? (
            <TagPostGrid posts={tag.posts} />
          ) : (
            <TagEmptyState />
          )}
        </section>

        <div className="mt-20">
          <NewsletterCTA />
        </div>
      </div>
    </>
  );
}