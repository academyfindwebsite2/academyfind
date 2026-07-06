"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export async function markAllRead() {
  const session = await requireAuth();
  const isAdmin = session.user.role === "ADMIN";

  if (isAdmin) {
    await prisma.adminNotification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  } else {
    await prisma.userNotification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
  }
  revalidatePath("/notifications");
}

export async function markRead(id: string) {
  const session = await requireAuth();
  const isAdmin = session.user.role === "ADMIN";

  if (isAdmin) {
    await prisma.adminNotification.updateMany({
      where: { id },
      data: { isRead: true },
    });
  } else {
    await prisma.userNotification.updateMany({
      where: { id, userId: session.user.id },
      data: { isRead: true },
    });
  }
  revalidatePath("/notifications");
}

export async function dismissNotification(id: string) {
  const session = await requireAuth();
  const isAdmin = session.user.role === "ADMIN";

  if (isAdmin) {
    await prisma.adminNotification.delete({
      where: { id },
    });
  } else {
    await prisma.userNotification.delete({
      where: { id, userId: session.user.id },
    });
  }
  revalidatePath("/notifications");
}
