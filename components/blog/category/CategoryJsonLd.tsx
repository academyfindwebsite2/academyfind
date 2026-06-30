type CategoryJsonLdProps = {
  category: {
    name: string;
    slug: string;
    description: string | null;
    coverImage: string | null;

    postCount: number;
    totalViews: number;

    posts: {
      id: string;
      title: string;
      slug: string;
      publishedAt: Date | null;

      authorProfile: {
        displayName: string;
      } | null;
      brand: {
        name: string;
      } | null;
    }[];
  };
};

export default function CategoryJsonLd({
  category,
}: CategoryJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const pageUrl = `${siteUrl}/blog/category/${category.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CollectionPage",

        "@id": `${pageUrl}#collection`,

        url: pageUrl,

        name: `${category.name} Articles`,

        description:
          category.description ??
          `Browse ${category.name} articles on AcademyFind.`,

        image: category.coverImage,

        isPartOf: {
          "@type": "WebSite",
          name: "AcademyFind",
          url: siteUrl,
        },

        mainEntity: {
          "@id": `${pageUrl}#category`,
        },
      },

      {
        "@type": "DefinedTerm",

        "@id": `${pageUrl}#category`,

        name: category.name,

        description: category.description,

        url: pageUrl,

        inDefinedTermSet: `${siteUrl}/blog`,
      },

      {
        "@type": "ItemList",

        "@id": `${pageUrl}#articles`,

        numberOfItems: category.posts.length,

        itemListElement: category.posts.map((post, index) => ({
          "@type": "ListItem",

          position: index + 1,

          url: `${siteUrl}/blog/${post.slug}`,

          item: {
            "@type": "BlogPosting",

            headline: post.title,

            url: `${siteUrl}/blog/${post.slug}`,

            datePublished: post.publishedAt?.toISOString(),

            author: post.authorProfile
              ? {
                  "@type": "Person",
                  name: post.authorProfile.displayName,
                }
              : {
                  "@type": "Organization",
                  name: post.brand?.name ?? "AcademyFind",
                },
          },
        })),
      },

      {
        "@type": "BreadcrumbList",

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Blog",
            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}
