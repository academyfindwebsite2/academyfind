import { Metadata } from "next";
import Script from "next/script";

// ─── 1. METADATA (Server-Side SEO) ───────────────────────────
export const metadata: Metadata = {
  title: "Expert Life Coach & Student Mentorship | AcademyFind",
  description: "Confused about your career path? Book a free 1-on-1 strategy call with an expert life coach at AcademyFind. Get clarity, goal mapping, and career guidance.",
  alternates: {
    canonical: "https://www.academyfind.com/life-coach",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Expert Life Coach & Mentorship | AcademyFind",
    description: "Book a free strategy session to clear your career confusion.",
    url: "https://www.academyfind.com/life-coach",
    siteName: "AcademyFind",
    type: "website",
  },
  keywords: [
    "life coach for students",
    "career counseling",
    "student mentorship",
    "career guidance near me",
    "education consultant",
    "book strategy call",
    "exam preparation confusion",
    "AcademyFind life coach",
  ],
};

export default function LifeCoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = "https://www.academyfind.com";

  // ─── 2. JSON-LD (Service & FAQ Schema) ───────────────────────
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Student Life Coaching & Mentorship",
    provider: {
      "@type": "Organization",
      name: "AcademyFind",
      url: baseUrl,
    },
    description: "1-on-1 personalized mentorship and career counseling for students to help them achieve clarity and set actionable educational goals.",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mentorship Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Free Strategy Call",
          },
        },
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Life Coach", item: `${baseUrl}/life-coach` },
    ],
  };

  return (
    <>
      <Script
        id="schema-life-coach-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="schema-life-coach-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}