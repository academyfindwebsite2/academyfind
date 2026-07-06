import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageCircle, Users } from "lucide-react";

type Props = { params: Promise<{ instituteId: string }> };

export default async function ManagerCommunityPage({ params }: Props) {
  const { instituteId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const institute = await prisma.institute.findUnique({
    where: { id: instituteId },
    select: { id: true, name: true },
  });
  if (!institute) notFound();

  // Fetch institute channels
  const channels = await prisma.conversation.findMany({
    where: { instituteId, type: "INSTITUTE" },
    orderBy: { channelType: "asc" },
    select: {
      id: true,
      title: true,
      channelType: true,
      isReadOnly: true,
      memberCount: true,
      lastMessage: {
        select: { content: true, sender: { select: { name: true } } },
      },
    },
  });

  // Fetch reported messages
  const reports = await prisma.messageReport.findMany({
    where: {
      message: { conversation: { instituteId } },
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      reason: true,
      status: true,
      createdAt: true,
      message: {
        select: {
          id: true,
          content: true,
          sender: { select: { name: true, username: true } },
          conversation: { select: { title: true, channelType: true } },
        },
      },
      reporter: { select: { name: true, username: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Community</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage channels and moderate messages for {institute.name}.
        </p>
        <div className="mt-3">
          <Link
            href={`/chat`}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            Open chat workspace →
          </Link>
        </div>
      </div>

      {/* Channels overview */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <MessageCircle className="size-5 text-violet-500" /> Channels
        </h2>
        {channels.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
            No channels yet. They'll be created automatically when the first member joins.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    {ch.title ?? `# ${ch.channelType?.toLowerCase()}`}
                  </h3>
                  {ch.isReadOnly && (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase">
                      Read-only
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {ch.memberCount} members
                  </span>
                </div>
                {ch.lastMessage && (
                  <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-400 mb-1">Last message</p>
                    <p className="line-clamp-2">{ch.lastMessage.content}</p>
                  </div>
                )}
                <div className="mt-4">
                  <Link
                    href={`/chat/${ch.id}`}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                  >
                    Open channel →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reported messages */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          🚨 Reported Messages
          {reports.length > 0 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {reports.length}
            </span>
          )}
        </h2>
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
            No pending reports. 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Reported in{" "}
                      <span className="text-amber-700">
                        {r.message.conversation.title ?? r.message.conversation.channelType}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      By @{r.message.sender.username}: &quot;
                      {r.message.content?.slice(0, 100)}
                      {(r.message.content?.length ?? 0) > 100 ? "…" : ""}&quot;
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Reason: <span className="font-medium text-rose-600">{r.reason}</span>{" "}
                      · Reported by @{r.reporter.username} ·{" "}
                      {r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-rose-200 bg-white px-2 py-0.5 text-xs font-bold text-rose-600">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
