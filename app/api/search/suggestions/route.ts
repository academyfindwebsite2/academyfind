// app/api/search/suggestions/route.ts

import { NextResponse } from "next/server";
import { meili } from "@/lib/meilisearch";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const result = await meili
    .index("global_search")
    .search(q, {
      limit: 8,
      attributesToHighlight: ["name"],
    });

  return NextResponse.json(result.hits);
}