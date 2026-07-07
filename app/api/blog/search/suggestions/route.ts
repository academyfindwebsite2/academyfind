import { NextRequest, NextResponse } from "next/server";
import { meili } from "@/lib/meilisearch";

const index = meili.index("global_search");

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    if (process.env.USE_MEILISEARCH !== 'true') {
      throw new Error("Meilisearch disabled, fallback to DB");
    }


    const results = await index.search(query, {
      filter: ['type IN ["blog","category","tag"]'],
      limit: 8,
    });

    const suggestions = results.hits.map((hit: any) => {
      switch (hit.type) {
        case "blog":
          return {
            id: hit.id,
            type: "blog",
            title: hit.title ?? hit.name,
            subtitle: typeof hit.category === 'object' && hit.category ? hit.category.name : hit.category,
            url: `/blog/${hit.slug}`,
          };

        case "category":
          return {
            id: hit.id,
            type: "category",
            title: hit.name,
            subtitle: "Category",
            url: `/blog/category/${hit.slug}`,
          };

        case "tag":
          return {
            id: hit.id,
            type: "tag",
            title: hit.name,
            subtitle: "Tag",
            url: `/blog/tag/${hit.slug}`,
          };

        default:
          return null;
      }
    });

    return NextResponse.json(
      suggestions.filter(Boolean),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Search suggestions error:", error);

    // DB Fallback
    try {
      const fallbackQuery = request.nextUrl.searchParams.get("q")?.trim();
      if (!fallbackQuery || fallbackQuery.length < 2) return NextResponse.json([]);

      const { prisma } = await import("@/lib/prisma");

      const [blogs, categories] = await Promise.all([
        prisma.blogPost.findMany({
          where: {
            status: "PUBLISHED",
            visibility: "PUBLIC",
            OR: [
              { title: { contains: fallbackQuery, mode: "insensitive" } },
            ],
          },
          include: { category: true },
          take: 4,
        }),
        prisma.blogCategory.findMany({
          where: {
            isActive: true,
            name: { contains: fallbackQuery, mode: "insensitive" },
          },
          take: 4,
        }),
      ]);

      const suggestions = [
        ...blogs.map((b: any) => ({
          id: b.id,
          type: "blog",
          title: b.title,
          subtitle: b.category?.name,
          url: `/blog/${b.slug}`,
        })),
        ...categories.map((c: any) => ({
          id: c.id,
          type: "category",
          title: c.name,
          subtitle: "Category",
          url: `/blog/category/${c.slug}`,
        }))
      ];

      return NextResponse.json(suggestions, { status: 200 });
    } catch (fallbackError) {
      return NextResponse.json([], { status: 200 });
    }
  }
}