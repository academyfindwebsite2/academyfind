import { meili } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const PLAN_PRIORITY: Record<string, number> = { ULTRA: 4, PREMIUM: 3, VERIFIED: 2, BASIC: 1 };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const exclude = searchParams.get("exclude") || "";
    const enquiryId = searchParams.get("enquiryId") || "";
    const countOnly = searchParams.get("countOnly") === "true";

    const plansAll = searchParams.get("plansAll") === "true";
    const citiesAll = searchParams.get("citiesAll") === "true";
    const categoriesAll = searchParams.get("categoriesAll") === "true";

    const plans = (searchParams.get("plans") || "").split(",").filter(Boolean);
    const cityIds = (searchParams.get("cities") || "").split(",").filter(Boolean);
    const categoryIds = (searchParams.get("categories") || "").split(",").filter(Boolean);
    const search = searchParams.get("search") || "";

    const filter: string[] = [];
    filter.push(`type = "institute"`);
    if (exclude) filter.push(`prismaId != "${exclude}"`);
    if (!plansAll && plans.length > 0) filter.push(`(${plans.map((p: string) => `subscriptionPlan = "${p}"`).join(" OR ")})`);
    if (!citiesAll && cityIds.length > 0) {
      filter.push(`(${cityIds.map((id: string) => `cityId = "${id}"`).join(" OR ")})`);
    }
    if (!categoriesAll && categoryIds.length > 0) {
      filter.push(`(${categoryIds.map((id: string) => `categoryIds = "${id}"`).join(" OR ")})`);
    }
    filter.push("isActive = true");
    filter.push("isPublished = true");

    const index = meili.index("global_search");

    // Bulk mode: return count breakdown (already have + new)
    if (countOnly) {
      const result = await index.search(search.trim() || "*", { filter, limit: 1 });
      const totalCount = result.estimatedTotalHits ?? result.hits.length;

      // Get count of institutes that already have this lead
      let alreadyHaveCount = 0;
      if (enquiryId) {
        const allResults = await index.search(search.trim() || "*", { 
          filter, 
          limit: 10000,
          attributesToRetrieve: ["prismaId"]
        });
        const instituteIds = (allResults.hits as any[]).map((h: any) => h.prismaId);
        
        if (instituteIds.length > 0) {
          const existing = await prisma.instituteEnquiry.findMany({
            where: { parentId: enquiryId, instituteId: { in: instituteIds } },
            select: { instituteId: true },
          });
          alreadyHaveCount = existing.length;
        }
      }

      const newReach = Math.max(0, totalCount - alreadyHaveCount);
      return NextResponse.json({ 
        totalCount,
        alreadyHaveCount,
        newReach
      });
    }

    // Individual mode: fetch ALL institutes (removed 50 limit)
    const results = await index.search(search.trim() || "*", {
      filter,
      limit: 10000, // Increased limit to get all institutes
      attributesToRetrieve: ["prismaId", "name", "subscriptionPlan"],
    });

    const instituteIds = (results.hits as any[]).map((h: any) => h.prismaId);
    if (instituteIds.length === 0) return NextResponse.json({ institutes: [] });

    const institutes = await prisma.institute.findMany({
      where: { id: { in: instituteIds } },
      select: { id: true, name: true, subscriptionPlan: true, city: { select: { name: true } } },
    });

    let existingLeadSet = new Set<string>();
    if (enquiryId) {
      const existing = await prisma.instituteEnquiry.findMany({
        where: { parentId: enquiryId, instituteId: { in: instituteIds } },
        select: { instituteId: true },
      });
      existingLeadSet = new Set(existing.map((e: { instituteId: string }) => e.instituteId));
    }

    const withFlags = institutes
      .map((inst: { id: string; name: string; subscriptionPlan: string; city: { name: string } }) => ({ ...inst, hasExistingLead: existingLeadSet.has(inst.id) }))
      .sort((a: { hasExistingLead: boolean; subscriptionPlan: string }, b: { hasExistingLead: boolean; subscriptionPlan: string }) => {
        // Sort: leads without existing lead first, then by plan priority
        if (a.hasExistingLead !== b.hasExistingLead) {
          return a.hasExistingLead ? 1 : -1;
        }
        return (PLAN_PRIORITY[b.subscriptionPlan] ?? 0) - (PLAN_PRIORITY[a.subscriptionPlan] ?? 0);
      });

    return NextResponse.json({ institutes: withFlags });
  } catch (error) {
    console.error("Error searching institutes:", error);
    return NextResponse.json({ error: "Failed to search institutes" }, { status: 500 });
  }
}