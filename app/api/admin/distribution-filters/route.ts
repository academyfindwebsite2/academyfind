import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    // Get only leaf categories (those with no children)
    const categories = await prisma.category.findMany({
      where: { 
        isActive: true,
        children: { none: {} } // Only categories with NO children (leaf nodes)
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      cities: cities.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })),
      categories: categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })),
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}