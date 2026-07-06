import type { NotificationType } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function notifyUser(
  userId: string,
  type: NotificationType,
  title: string,
  body?: string,
  entityId?: string,
) {
  try {
    return await prisma.userNotification.create({
      data: { userId, type, title, body, entityId },
    });
  } catch (error) {
    console.error("Unable to create user notification", error);
    return null;
  }
}

export async function notifyAdmins(
  type: string,
  title: string,
  message: string,
  actionUrl?: string,
  referenceId?: string,
) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN", isActive: true },
      select: { id: true },
    });

    if (admins.length === 0) return { count: 0 };

    return await prisma.adminNotification.createMany({
      data: admins.map(({ id }) => ({
        type,
        title,
        message,
        actionUrl,
        referenceId,
        userId: id,
      })),
    });
  } catch (error) {
    console.error("Unable to notify admins", error);
    return null;
  }
}
