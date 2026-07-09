// app/api/search/suggestions/route.ts

import { NextResponse } from "next/server";
import { meili } from "@/lib/meilisearch";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const result = await meili
      .index("global_search")
      .search(q, {
        limit: 8,
        attributesToHighlight: ["name"],
      });

    return NextResponse.json(result.hits);
  } catch (error) {
    console.error("MeiliSearch Error in suggestions API:", error);
    // Return empty array instead of crashing if index doesn't exist or Meili is down
    return NextResponse.json([]);
  }
}