import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: conversationId } = await params;

  // Verify participant
  const participant = await prisma.conversationParticipant.findFirst({
    where: { conversationId, userId: session.user.id, status: "ACTIVE" },
    select: { id: true },
  });
  if (!participant) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Cursor-based pagination
  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const take = Math.min(Number(url.searchParams.get("take") ?? 50), 100);

  const messages = await prisma.message.findMany({
    where: { conversationId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      content: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      isEdited: true,
      isPinned: true,
      isDeleted: true,
      replyToId: true,
      replyTo: {
        select: {
          id: true,
          content: true,
          sender: { select: { name: true } },
        },
      },
      sender: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      attachments: {
        select: { id: true, fileUrl: true, fileName: true, mimeType: true, size: true },
      },
      reactions: {
        select: {
          id: true,
          emoji: true,
          userId: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  const nextCursor =
    messages.length === take ? messages[messages.length - 1].id : null;

  // Mark conversation as read (update lastReadAt)
  await prisma.conversationParticipant.update({
    where: { id: participant.id },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json({
    messages: messages.reverse(), // chronological
    nextCursor,
  });
}
