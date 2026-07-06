import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ count: 0 });

  const isAdmin = session.user.role === "ADMIN";

  if (isAdmin) {
    const count = await prisma.adminNotification.count({
      where: { isRead: false },
    });
    return NextResponse.json({ count });
  }

  const count = await prisma.userNotification.count({
    where: { userId: session.user.id, isRead: false },
  });
  return NextResponse.json({ count });
}
