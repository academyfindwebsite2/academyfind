import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateDm } from "@/lib/chat/createDm";

export default async function ChatIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; instituteId?: string }>;
}) {
  const { userId, instituteId } = await searchParams;

  let redirectUrl: string | null = null;

  if (userId || instituteId) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) {
      try {
        if (userId) {
          const conversation = await getOrCreateDm(session.user.id, userId);
          redirectUrl = `/chat/${conversation.id}`;
        } else if (instituteId) {
          // Check if they are a manager
          const isManager = await prisma.instituteManager.findFirst({
            where: { instituteId, userId: session.user.id },
          });

          // Check if they are a member
          const membership = await prisma.instituteMembership.findFirst({
            where: { instituteId, userId: session.user.id, status: "ACTIVE" },
          });

          const isAdmin = session.user.role === "ADMIN";

          let role: "STUDENT" | "TEACHER" | "MANAGER" | "ADMIN" | null = null;
          if (isAdmin) {
            role = "ADMIN";
          } else if (isManager) {
            role = "MANAGER";
          } else if (membership) {
            role = membership.role as "STUDENT" | "TEACHER" | "ADMIN";
          }

          if (role) {
            // Import and call dynamically to avoid circular dependencies if any
            const { addMemberToInstituteChannels } = await import("@/lib/chat/ensureInstituteChannels");
            await addMemberToInstituteChannels(session.user.id, instituteId, role);

            const generalChannel = await prisma.conversation.findUnique({
              where: {
                instituteId_channelType: {
                  instituteId,
                  channelType: "GENERAL",
                },
              },
              select: { id: true },
            });
            if (generalChannel) {
              redirectUrl = `/chat/${generalChannel.id}`;
            }
          } else {
            // Not a member, shouldn't have access to institute chat
            console.error("User is not a member of this institute");
          }
        }
      } catch (e) {
        // If they can't message this user (blocked, disabled DMs) or channel doesn't exist, we fall through to the empty state
        console.error("Chat conversation fetch error:", e);
      }
    }
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-50 border border-amber-200">
        <MessageCircle className="size-10 text-amber-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Your messages</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-xs">
          Select a conversation from the sidebar, or start a new direct message.
        </p>
      </div>
      <div className="mt-4 text-sm text-slate-500">
        Find institutes in the directory to message their members.
      </div>
    </div>
  );
}
