"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Hash, MessageCircle, Pin, Search, Users } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type ConversationType = "DIRECT" | "INSTITUTE" | "BATCH" | "GROUP" | "AI";

interface ConversationItem {
  id: string;
  type: ConversationType;
  displayName: string;
  displayImage: string | null;
  channelType: string | null;
  isPinned: boolean;
  lastReadAt: string | null;
  lastMessageAt: string | null;
  lastMessage: {
    content: string | null;
    type: string;
    sender: { name: string | null };
    createdAt: string;
  } | null;
  instituteId: string | null;
  dmUserId: string | null;
}

export function ConversationSidebar({ userId }: { userId: string }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useSWR<{ conversations: ConversationItem[] }>(
    "/api/v2/conversations",
    fetcher,
    { refreshInterval: 8000 },
  );

  const conversations = data?.conversations ?? [];

  const filtered = conversations.filter((c: ConversationItem) =>
    c.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  const pinned = filtered.filter((c: ConversationItem) => c.isPinned);
  const dms = filtered.filter((c: ConversationItem) => !c.isPinned && c.type === "DIRECT");
  const channels = filtered.filter(
          (c: ConversationItem) => !c.isPinned && c.type !== "DIRECT",
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <h2 className="text-base font-bold text-slate-900">Messages</h2>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 focus-within:border-amber-300 focus-within:bg-white">
          <Search className="size-4 shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            Loading…
          </div>
        )}

        {!isLoading && conversations.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            No conversations yet.
            <br />
            Find institutes to chat with their members.
          </div>
        )}

        {pinned.length > 0 && (
          <SectionGroup label="Pinned">
            {pinned.map((c: ConversationItem) => (
              <ConvoCard key={c.id} convo={c} isActive={pathname.includes(c.id)} />
            ))}
          </SectionGroup>
        )}

        {dms.length > 0 && (
          <SectionGroup label="Direct Messages">
            {dms.map((c: ConversationItem) => (
              <ConvoCard key={c.id} convo={c} isActive={pathname.includes(c.id)} />
            ))}
          </SectionGroup>
        )}

        {channels.length > 0 && (
          <SectionGroup label="Channels">
            {channels.map((c: ConversationItem) => (
              <ConvoCard key={c.id} convo={c} isActive={pathname.includes(c.id)} />
            ))}
          </SectionGroup>
        )}
      </div>
    </aside>
  );
}

function SectionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}

function ConvoCard({
  convo,
  isActive,
}: {
  convo: ConversationItem;
  isActive: boolean;
}) {
  // has unread if lastMessageAt is after lastReadAt (or never read)
  const hasUnread =
    convo.lastMessageAt != null &&
    (convo.lastReadAt == null ||
      new Date(convo.lastMessageAt) > new Date(convo.lastReadAt));

  return (
    <Link
      href={`/chat/${convo.id}`}
      className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
        isActive
          ? "bg-amber-50 border-r-2 border-amber-400"
          : "hover:bg-slate-50"
      }`}
    >
      {/* Avatar */}
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
        {convo.displayImage ? (
          <Image
            src={convo.displayImage}
            alt=""
            fill
            className="object-cover"
          />
        ) : convo.type === "DIRECT" ? (
          <span className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
            {(convo.displayName ?? "?").charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="flex h-full items-center justify-center text-base">
            {convo.channelType === "ANNOUNCEMENTS" ? "📢" : "#"}
          </span>
        )}
        {hasUnread && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-rose-500" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span
            className={`truncate text-sm ${hasUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
          >
            {convo.displayName}
          </span>
          {hasUnread && (
            <span className="ml-1 shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
              ●
            </span>
          )}
        </div>
        {convo.lastMessage && (
          <p
            className={`truncate text-xs ${hasUnread ? "text-slate-600" : "text-slate-400"}`}
          >
            {convo.type !== "DIRECT" &&
              convo.lastMessage?.sender.name &&
              `${convo.lastMessage.sender.name.split(" ")[0]}: `}
            {convo.lastMessage.type === "IMAGE"
              ? "📷 Photo"
              : convo.lastMessage.type === "FILE"
              ? "📎 File"
              : (convo.lastMessage.content ?? "")}
          </p>
        )}
      </div>
    </Link>
  );
}
