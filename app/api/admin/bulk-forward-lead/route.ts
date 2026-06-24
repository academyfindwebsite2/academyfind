import { meili } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      originalEnquiryId,
      originalInstituteId,
      plansAll, plans,
      citiesAll, cityIds,
      categoriesAll, categoryIds,
      search,
      adminNote,
    } = body;

    if (!originalEnquiryId) {
      return NextResponse.json({ error: "Missing originalEnquiryId" }, { status: 400 });
    }

    const originalEnquiry = await prisma.instituteEnquiry.findUnique({
      where: { id: originalEnquiryId },
    });
    if (!originalEnquiry) {
      return NextResponse.json({ error: "Original enquiry not found" }, { status: 404 });
    }

    // Build Meilisearch filter — "All" for a dimension means: skip that filter entirely
    const filter: string[] = [];
    if (originalInstituteId) filter.push(`id != "${originalInstituteId}"`);

    if (!plansAll && Array.isArray(plans) && plans.length > 0) {
      filter.push(`(${plans.map((p: string) => `subscriptionPlan = "${p}"`).join(" OR ")})`);
    }
    if (!citiesAll && Array.isArray(cityIds) && cityIds.length > 0) {
      filter.push(`(${cityIds.map((id: string) => `cityId = "${id}"`).join(" OR ")})`);
    }
    if (!categoriesAll && Array.isArray(categoryIds) && categoryIds.length > 0) {
      filter.push(`(${categoryIds.map((id: string) => `categoryIds = "${id}"`).join(" OR ")})`);
    }
    filter.push("isActive = true");
    filter.push("isPublished = true");

    const index = meili.index("institutes");

    // Paginate through every match — bulk targets can exceed a single page
    const PAGE_SIZE = 200;
    const SAFETY_CAP = 5000;
    let offset = 0;
    let allIds: string[] = [];

    while (true) {
      const page = await index.search(search?.trim() || "*", {
        filter,
        limit: PAGE_SIZE,
        offset,
        attributesToRetrieve: ["id"],
      });
      const ids = (page.hits as { id: string }[]).map((h: { id: string }) => h.id);
      allIds.push(...ids);
      if (ids.length < PAGE_SIZE || offset > SAFETY_CAP) break;
      offset += PAGE_SIZE;
    }

    if (allIds.length === 0) {
      return NextResponse.json({ success: true, message: "No matching institutes found", count: 0 });
    }

    // Skip institutes that already have this lead (linked via parentId)
    const existing = await prisma.instituteEnquiry.findMany({
      where: { parentId: originalEnquiryId, instituteId: { in: allIds } },
      select: { instituteId: true },
    });
    const existingSet = new Set(existing.map((e: { instituteId: string }) => e.instituteId));
    const targetIds = allIds.filter((id: string) => !existingSet.has(id));

    if (targetIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All matching institutes already have this lead",
        count: 0,
      });
    }

    await prisma.instituteEnquiry.update({
      where: { id: originalEnquiryId },
      data: { isForwarded: true, adminNote },
    });

    const result = await prisma.instituteEnquiry.createMany({
      data: targetIds.map((instituteId: string) => ({
        instituteId,
        name: originalEnquiry.name,
        phone: originalEnquiry.phone,
        message: originalEnquiry.message,
        parentId: originalEnquiryId,
        status: "NEW",
        isForwarded: false,
        adminNote: adminNote ? `[Forwarded] ${adminNote}` : undefined,
      })),
    });

    return NextResponse.json({
      success: true,
      message: `Lead forwarded to ${result.count} institutes`,
      count: result.count,
      skipped: existingSet.size,
    });
  } catch (error) {
    console.error("Error bulk forwarding lead:", error);
    return NextResponse.json({ error: "Failed to bulk forward lead" }, { status: 500 });
  }
}