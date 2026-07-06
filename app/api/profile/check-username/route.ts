import { NextResponse } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const value = new URL(request.url).searchParams.get("username");
  const parsed = z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,30}$/)
    .safeParse(value);
  if (!parsed.success) {
    return NextResponse.json({ available: false, reason: "Invalid username" });
  }
  const existing = await prisma.user.findFirst({
    where: { username: parsed.data, id: { not: session.user.id } },
    select: { id: true },
  });
  return NextResponse.json({ available: !existing, username: parsed.data });
}
