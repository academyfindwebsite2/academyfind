// ============================================================
// OPTIMIZED METADATA + JSON-LD — AcademyFind All Categories Page
// ============================================================

import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Script from "next/script";

import CategoryContainer from "@/components/categories/CategoryContainer"; 
import CategoriesHero from "@/components/categories/CategoriesHero";
import CategoryStats from "@/components/categories/CategoriesStats";
import CategoryCTA from "@/components/category/CategoryCTA";
import MoreCategories from "@/components/categories/MoreCategories";

export const revalidate = 86400;

// ─── Types ───────────────────────────────────────────────────
interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

// ─── Helper for formatting slug ──────────────────────────────
function formatSlug(slug: string) {
  if (!slug) return "";
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// ─── 1. METADATA (Dynamic Hub Page SEO) ──────────────────────
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const citySlug = sp.city;
  const formattedCity = citySlug ? formatSlug(citySlug) : "";

  const currentYear = new Date().getFullYear();
  
  // Agar search param mein city hai, toh title mein city ka naam aayega
  const seoTitle = citySlug 
    ? `Explore Coaching & Education Categories in ${formattedCity} | AcademyFind`
    : `Explore All Coaching & Education Categories ${currentYear} | AcademyFind`;

  const seoDescription = citySlug
    ? `Browse all coaching institutes, schools, and hostels in ${formattedCity}. Find the best educational centers by category on AcademyFind.`
    : `Discover top-rated coaching institutes, schools, and hostels across India. Browse our comprehensive directory by category to find the perfect match.`;

  return {
    title: seoTitle,
    description: seoDescription,
    // Canonical tag is strictly the base route to avoid ?city= duplicate indexing penalty
    alternates: {
      canonical: "https://www.academyfind.com/categories",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: "https://www.academyfind.com/categories",
      siteName: "AcademyFind",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://www.academyfind.com/new-logo.png",
          width: 1200,
          height: 630,
          alt: "AcademyFind Categories",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      site: "@academyfind",
      images: ["https://www.academyfind.com/new-logo.png"],
    },
    keywords: [
      "education categories",
      "coaching institutes list",
      "find schools in India",
      "list of hostels",
      "best coaching categories",
      "education directory India",
      "compare coaching classes",
      "search educational institutes",
      "JEE NEET UPSC coaching",
      "AcademyFind categories",
    ],
  };
}

// ─── 2. JSON-LD COMPONENT ────────────────────────────────────
interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface JsonLdProps {
  parentCategories: CategoryItem[];
}

function JsonLdSchemas({ parentCategories }: JsonLdProps) {
  const baseUrl = "https://www.academyfind.com";
  const pageUrl = `${baseUrl}/categories`;
  const currentYear = new Date().getFullYear();

  // ── a) ItemList Schema (Listing the main categories for Google) ──
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Academic and non Academic Categories ${currentYear}`,
    description: "A comprehensive list of all educational, extracurricular and sports categories available on AcademyFind.",
    url: pageUrl,
    numberOfItems: parentCategories.length,
    itemListElement: parentCategories.map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/${cat.slug}`,
      name: cat.name,
    })),
  };

  // ── b) BreadcrumbList Schema ──
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Categories",
        item: pageUrl,
      },
    ],
  };

  // ── c) FAQPage Schema ──
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What type of educational institutes are listed on AcademyFind?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AcademyFind covers a wide range of educational institutes including competitive exam coaching (JEE, NEET, UPSC), skill development classes, schools, colleges, and student hostels across India.",
        },
      },
      {
        "@type": "Question",
        name: "How can I find the best coaching institute for my needs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can browse our categories or use the search bar to find institutes. We provide detailed filters like distance, ratings, and fee structures, along with verified student reviews to help you make an informed decision.",
        },
      },
      {
        "@type": "Question",
        name: "Are online coaching classes available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, many of the categories include institutes that offer hybrid or fully online learning modes. You can easily filter your results to show only online classes.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-itemlist-cats"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id="schema-breadcrumb-cats"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-faq-cats"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

// ─── 3. PAGE COMPONENT ───────────────────────────────────────
export default async function CategoriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const citySlug = sp.city;

  // Prisma se heavy nested data fetch kiya
  const parentCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          children: {
            include: {
              _count: {
                select: {
                  institutes: {
                    where: {
                      institute: { isActive: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // Schema ke liye array ko thoda halka kiya (taki TypeScript khush rahe aur load kam pade)
  const simplifiedCategories = parentCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <>
      <JsonLdSchemas parentCategories={simplifiedCategories} />

      {/* 👇 citySlug sabko as prop bhej diya */}
      <CategoriesHero citySlug={citySlug} />
      <CategoryStats citySlug={citySlug} />
      <CategoryContainer parentCategories={parentCategories} citySlug={citySlug} />
      <MoreCategories citySlug={citySlug} />  
      <CategoryCTA />
    </>
  );
}