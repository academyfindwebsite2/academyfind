import { prisma } from "@/lib/prisma";

export async function ensureBatchConversation(
  instituteId: string,
  batchId: string,
  batchName: string
) {
  const conv = await prisma.conversation.findFirst({
    where: { instituteId, batchId, type: "BATCH" },
  });

  if (conv) return conv;

  return prisma.conversation.create({
    data: {
      type: "BATCH",
      channelType: "BATCH",
      instituteId,
      batchId,
      title: `${batchName}`,
      isReadOnly: false,
      visibility: "PRIVATE",
    },
  });
}
