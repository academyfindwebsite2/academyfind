"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { getUserInstituteRole } from "@/lib/auth/getInstituteRole";
import { requireAuth } from "@/lib/auth/requireAuth";
import { getOrCreateDm } from "@/lib/chat/createDm";
import { moderateContent } from "@/lib/chat/moderateContent";
import { notifyUser } from "@/lib/notifications/notify";
import { prisma } from "@/lib/prisma";

const messageSchema = z.object({
  conversationId: z.string().cuid(),
  content: z.string().trim().min(1).max(5000),
  replyToId: z.string().cuid().optional(),
});

export async function createDirectConversation(
  receiverId: string,
  instituteId?: string,
) {
  const session = await requireAuth();
  const conversation = await getOrCreateDm(
    session.user.id,
    receiverId,
    instituteId,
  );
  return { success: true, conversationId: conversation.id };
}

export async function sendMessage(input: z.input<typeof messageSchema>) {
  const session = await requireAuth();
  const data = messageSchema.parse(input);
  const moderation = moderateContent(data.content);
  if (!moderation.ok) return { error: moderation.reason };

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: data.conversationId,
        userId: session.user.id,
      },
    },
    include: { conversation: true },
  });
  if (!participant || participant.status !== "ACTIVE") {
    return { error: "You do not have access to this conversation." };
  }

  if (participant.conversation.instituteId) {
    const role = await getUserInstituteRole(
      session.user.id,
      participant.conversation.instituteId,
    );
    const channel = participant.conversation.channelType;
    if (
      (channel === "ANNOUNCEMENTS" &&
        !["ADMIN", "MANAGER", "TEACHER"].includes(role)) ||
      (channel === "TEACHERS" &&
        !["ADMIN", "MANAGER", "TEACHER"].includes(role)) ||
      (channel === "STAFF" && !["ADMIN", "MANAGER"].includes(role))
    ) {
      return { error: "You cannot post in this channel." };
    }
  }

  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: session.user.id,
        content: data.content,
        replyToId: data.replyToId,
        searchText: data.content.toLowerCase(),
        senderNameSnapshot: session.user.name,
        senderAvatarSnapshot: session.user.image,
      },
    });
    await tx.conversation.update({
      where: { id: data.conversationId },
      data: {
        lastMessageId: created.id,
        lastMessageAt: created.createdAt,
        lastActivityAt: created.createdAt,
      },
    });
    return created;
  });

  const recipients = await prisma.conversationParticipant.findMany({
    where: {
      conversationId: data.conversationId,
      userId: { not: session.user.id },
      status: "ACTIVE",
      notificationsMuted: false,
    },
    select: { userId: true },
  });
  await Promise.all(
    recipients.map(({ userId }: { userId: string }) =>
      notifyUser(
        userId,
        "MESSAGE",
        `${session.user.name ?? "Someone"} sent you a message`,
        data.content.slice(0, 140),
        data.conversationId,
      ),
    ),
  );

  revalidateTag(`conversation:${data.conversationId}`, "max");
  return { success: true, message };
}

export async function markConversationRead(conversationId: string) {
  const session = await requireAuth();
  const latest = await prisma.message.findFirst({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true },
  });
  if (!latest) return { success: true };

  await prisma.conversationParticipant.updateMany({
    where: { conversationId, userId: session.user.id },
    data: {
      lastReadMessageId: latest.id,
      lastReadAt: new Date(),
      lastSeenAt: new Date(),
    },
  });
  return { success: true };
}

export async function pinMessage(messageId: string, pinned: boolean) {
  const session = await requireAuth();
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { conversation: true },
  });
  if (!message?.conversation.instituteId) return { error: "Message not found." };
  const role = await getUserInstituteRole(
    session.user.id,
    message.conversation.instituteId,
  );
  if (!["ADMIN", "MANAGER"].includes(role)) return { error: "Not authorized." };
  await prisma.message.update({
    where: { id: messageId },
    data: { isPinned: pinned },
  });
  return { success: true };
}
