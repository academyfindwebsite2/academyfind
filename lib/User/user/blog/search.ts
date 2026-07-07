import { BlogSearchDocument } from "@/types/BlogSearchDocument";
import { meili } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";
import { BlogStatus } from "@/app/generated/prisma/enums";

const index = meili.index("global_search");

export type SearchBlogPostsParams = {
  query?: string;
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  sort?: "relevance" | "latest" | "oldest" | "popular";
};

export async function searchBlogPosts({
  query = "",
  page = 1,
  limit = 9,
  category,
  tag,
  sort = "relevance",
}: SearchBlogPostsParams) {
  try {
    if (process.env.USE_MEILISEARCH !== 'true') {
      throw new Error("Meilisearch disabled, fallback to DB");
    }

    const filters = ['type = "blog"'];

    if (category) {
      filters.push(`categorySlug = "${category}"`);
    }

    if (tag) {
      filters.push(`tagSlugs = "${tag}"`);
    }

    let sortOption: string[] | undefined;

    switch (sort) {
      case "latest":
        sortOption = ["publishedAt:desc"];
        break;

      case "oldest":
        sortOption = ["publishedAt:asc"];
        break;

      case "popular":
        sortOption = ["viewCount:desc"];
        break;

      default:
        sortOption = undefined;
    }

    const results = await index.search<BlogSearchDocument>(query, {
      filter: filters,
      sort: sortOption,
      hitsPerPage: limit,
      page,
    });

    return {
      posts: results.hits.map((hit: BlogSearchDocument) => ({
        ...hit,
        publishedAt: hit.publishedAt
            ? new Date(hit.publishedAt)
            : null,
      })),

      total: results.estimatedTotalHits ?? 0,
      page,
      limit,
      totalPages: Math.ceil((results.estimatedTotalHits ?? 0) / limit) || 1,
      hasNextPage: page < (Math.ceil((results.estimatedTotalHits ?? 0) / limit) || 1),
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    // Requirements #14 & #5: Log failure with console.error and degrade gracefully to DB search fallback
    console.error("Meilisearch global_search search error, degrading to database query fallback:", error);

    try {
      const pageNum = Math.max(1, page);
      const skip = (pageNum - 1) * limit;

      const dbWhere: any = {
        status: BlogStatus.PUBLISHED,
        visibility: "PUBLIC",
      };

      if (category) {
        dbWhere.category = { slug: category };
      }

      if (tag) {
        dbWhere.tags = {
          some: {
            tag: { slug: tag },
          },
        };
      }

      const q = query.trim();
      if (q) {
        dbWhere.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { contentHtml: { contains: q, mode: "insensitive" } },
        ];
      }

      // Fetch matching blog posts
      const [dbPosts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where: dbWhere,
          include: {
            authorProfile: true,
            category: true,
            brand: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        }),
        prisma.blogPost.count({ where: dbWhere }),
      ]);

      // Relevance ranking algorithm in JS (since complex text search ranking in SQLite/Postgres varies)
      let rankedPosts = [...dbPosts];
      if (q) {
        const lowerQ = q.toLowerCase();
        const postsWithWeights = rankedPosts.map((post) => {
          let weight = 0;
          const title = post.title.toLowerCase();
          const excerpt = (post.excerpt ?? "").toLowerCase();
          const content = post.contentHtml.toLowerCase();

          if (title === lowerQ) {
            weight += 20;
          } else if (title.includes(lowerQ)) {
            weight += 10;
          }

          if (excerpt.includes(lowerQ)) {
            weight += 5;
          }

          if (content.includes(lowerQ)) {
            weight += 1;
          }

          return { post, weight };
        });

        // Sort by relevance weight desc, then publishedAt desc, then id desc
        postsWithWeights.sort((a, b) => {
          if (b.weight !== a.weight) {
            return b.weight - a.weight;
          }
          const timeA = a.post.publishedAt?.getTime() ?? 0;
          const timeB = b.post.publishedAt?.getTime() ?? 0;
          if (timeB !== timeA) {
            return timeB - timeA;
          }
          return b.post.id.localeCompare(a.post.id);
        });

        rankedPosts = postsWithWeights.map((pw) => pw.post);
      } else {
        // Deterministic sorting if no search query
        rankedPosts.sort((a, b) => {
          if (sort === "oldest") {
            const timeA = a.publishedAt?.getTime() ?? 0;
            const timeB = b.publishedAt?.getTime() ?? 0;
            if (timeA !== timeB) return timeA - timeB;
            return a.id.localeCompare(b.id);
          } else if (sort === "popular") {
            if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
            const timeA = a.publishedAt?.getTime() ?? 0;
            const timeB = b.publishedAt?.getTime() ?? 0;
            if (timeB !== timeA) return timeB - timeA;
            return b.id.localeCompare(a.id);
          } else {
            // default: "latest" or "relevance" without query
            const timeA = a.publishedAt?.getTime() ?? 0;
            const timeB = b.publishedAt?.getTime() ?? 0;
            if (timeB !== timeA) return timeB - timeA;
            return b.id.localeCompare(a.id);
          }
        });
      }

      // Apply pagination page offset limits
      const paginatedPosts = rankedPosts.slice(skip, skip + limit);
      const totalPages = Math.ceil(total / limit) || 1;

      return {
        posts: paginatedPosts,
        total,
        page: pageNum,
        limit,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      };

    } catch (dbFallbackError) {
      console.error("Search database fallback query failed too:", dbFallbackError);
      return {
        posts: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
  }
}

export async function getSearchFilters() {
  try {
    const [categories, tags] = await Promise.all([
      prisma.blogCategory.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),

      prisma.blogTag.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          slug: true,
          postCount: true,
        },
      }),
    ]);

    return {
      categories,
      tags,
    };
  } catch (error) {
    console.error("Error loading search filters:", error);

    return {
      categories: [],
      tags: [],
    };
  }
}