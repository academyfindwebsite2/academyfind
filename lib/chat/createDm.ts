import { prisma } from "@/lib/prisma";

export async function getOrCreateDm(
  initiatorId: string,
  receiverId: string,
  instituteId?: string,
) {
  if (initiatorId === receiverId) {
    throw new Error("You cannot message yourself");
  }

  const [initiator, receiver, block] = await Promise.all([
    prisma.user.findUnique({
      where: { id: initiatorId },
      select: { allowDms: true, chatSettings: true },
    }),
    prisma.user.findUnique({
      where: { id: receiverId },
      select: { allowDms: true, chatSettings: true },
    }),
    prisma.userBlock.findFirst({
      where: {
        isActive: true,
        OR: [
          { blockerId: initiatorId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: initiatorId },
        ],
      },
      select: { id: true },
    }),
  ]);

  if (!initiator || !receiver || block) throw new Error("Messaging unavailable");
  if (
    !initiator.allowDms ||
    !receiver.allowDms ||
    initiator.chatSettings?.allowDirectMessages === false ||
    receiver.chatSettings?.allowDirectMessages === false
  ) {
    throw new Error("Direct messages are disabled");
  }

  const dmKey = [initiatorId, receiverId].sort().join("_");

  let conversation = await prisma.conversation.findUnique({
    where: { dmKey },
    include: { participants: true },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        type: "DIRECT",
        dmKey,
        instituteId,
        participants: {
          create: [{ userId: initiatorId }, { userId: receiverId }],
        },
      },
      include: { participants: true },
    });
  } else {
    // Reactivate participants if they had left or hidden the conversation
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: conversation.id,
        userId: { in: [initiatorId, receiverId] },
      },
      data: { status: "ACTIVE", isHidden: false, leftAt: null },
    });
  }

  return conversation;
}
