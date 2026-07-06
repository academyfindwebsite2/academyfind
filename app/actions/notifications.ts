"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export async function markNotificationRead(notificationId: string) {
  const session = await requireAuth();
  await prisma.userNotification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { isRead: true },
  });
  revalidatePath("/notifications");
  return { success: true };
}

export async function markAllNotificationsRead() {
  const session = await requireAuth();
  await prisma.userNotification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/notifications");
  return { success: true };
}

export async function dismissNotification(notificationId: string) {
  const session = await requireAuth();
  await prisma.userNotification.deleteMany({
    where: { id: notificationId, userId: session.user.id },
  });
  revalidatePath("/notifications");
  return { success: true };
}
