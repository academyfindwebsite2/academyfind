import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumb from "@/components/blog/article/BreadCrumb";
import NewsletterCTA from "@/components/blog/article/NewsLetterCTA";

import CategoryHero from "@/components/blog/category/CategoryHero";
import CategoryPostGrid from "@/components/blog/category/CategoryPostGrid";
import CategoryEmptyState from "@/components/blog/category/CategoryEmptyState";
import CategoryJsonLd from "@/components/blog/category/CategoryJsonLd";

import { getCategoryBySlug } from "@/lib/User/user/blog/getcategory";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | AcademyFind",
      description: "The requested category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const title =
    category.metaTitle ??
    `${category.name} Articles | AcademyFind Blog`;

  const description =
    category.metaDescription ??
    category.description ??
    `Explore the latest ${category.name} articles on AcademyFind.`;

  const canonical = `${siteUrl}/blog/category/${category.slug}`;

  return {
    title,
    description,

    keywords: [
      category.name,
      "AcademyFind",
      "AcademyFind Blog",
      "Blog Category",
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

      images: category.coverImage
        ? [
            {
              url: category.coverImage,
              width: 1200,
              height: 630,
              alt: category.name,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.coverImage
        ? [category.coverImage]
        : [],
    },
  };
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <CategoryJsonLd category={category} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            {
              label: "Blog",
              href: "/blog",
            },
            {
              label: category.name,
            },
          ]}
        />

        <CategoryHero category={category} />

        <section className="mt-14">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Latest Articles
            </h2>

            <p className="mt-2 text-slate-600">
              {category.postCount} published article
              {category.postCount !== 1 && "s"}
            </p>
          </div>

          {category.posts.length > 0 ? (
            <CategoryPostGrid posts={category.posts} />
          ) : (
            <CategoryEmptyState />
          )}
        </section>

        <div className="mt-20">
          <NewsletterCTA />
        </div>
      </div>
    </>
  );
}