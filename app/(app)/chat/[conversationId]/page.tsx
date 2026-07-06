import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

import { MessageWindow } from "@/app/(app)/chat/MessageWindow";

type Props = { params: Promise<{ conversationId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conversationId } = await params;
  return { title: `Chat | AcademyFind` };
}

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // Verify the user is a participant
  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      userId: session.user.id,
      status: "ACTIVE",
    },
  });

  if (!participant) notFound();

  return (
    <MessageWindow
      conversationId={conversationId}
      currentUserId={session.user.id}
    />
  );
}
