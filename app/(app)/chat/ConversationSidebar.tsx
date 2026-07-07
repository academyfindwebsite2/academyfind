"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Hash, MessageCircle, Pin, Search, Users, ArrowLeft } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"DIRECT" | "CHANNELS">("DIRECT");

  const { data, isLoading } = useSWR<{ conversations: ConversationItem[] }>(
    "/api/v2/conversations",
    fetcher,
    { refreshInterval: 8000 },
  );

  const conversations = data?.conversations ?? [];
  const isConversationActive = pathname !== "/chat";

  const filtered = conversations.filter((c: ConversationItem) =>
    c.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  const pinned = filtered.filter((c: ConversationItem) => c.isPinned);
  const dms = filtered.filter((c: ConversationItem) => !c.isPinned && c.type === "DIRECT");
  const channels = filtered.filter(
          (c: ConversationItem) => !c.isPinned && c.type !== "DIRECT",
  );

  return (
    <aside className={`w-full md:w-80 shrink-0 flex-col border-r border-white/20 bg-white/40 backdrop-blur-2xl transition-all duration-300 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] ${isConversationActive ? "hidden md:flex" : "flex"}`}>
      {/* Frosted Header */}
      <div className="flex flex-col gap-3 border-b border-white/40 px-4 py-4 bg-white/50 backdrop-blur-md relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-purple-500/5 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <h2 className="text-xl font-extrabold text-slate-800 drop-shadow-sm flex items-center gap-2">
            <Link href="/" className="p-1.5 bg-white/60 hover:bg-white rounded-full text-slate-600 transition-all shadow-sm border border-white/60">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            Messages
          </h2>
        </div>
        
        {/* Tab Toggle */}
        <div className="flex gap-2 p-1 bg-white/40 rounded-xl shadow-inner border border-white/60 relative z-10">
            <button 
              onClick={() => setActiveTab('DIRECT')} 
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'DIRECT' ? 'bg-white shadow-sm text-amber-600 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              Direct
            </button>
            <button 
              onClick={() => setActiveTab('CHANNELS')} 
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'CHANNELS' ? 'bg-white shadow-sm text-amber-600 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              Channels
            </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-white/30 bg-white/20">
        <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/50 shadow-inner px-3 py-2 text-sm text-slate-400 focus-within:border-amber-300 focus-within:bg-white focus-within:shadow-md transition-all">
          <Search className="size-4 shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none font-medium"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 custom-scrollbar">
        {isLoading && (
          <div className="px-4 py-8 text-center text-sm font-medium text-slate-400 animate-pulse">
            Loading...
          </div>
        )}

        {!isLoading && conversations.length === 0 && (
          <div className="px-4 py-8 text-center text-sm font-medium text-slate-400 bg-white/30 rounded-2xl border border-white/50 m-2">
            No conversations yet.
            <br />
            Find institutes to chat.
          </div>
        )}

        {pinned.length > 0 && (
          <SectionGroup label="Pinned">
            {pinned.map((c: ConversationItem) => (
              <ConvoCard key={c.id} convo={c} isActive={pathname.includes(c.id)} />
            ))}
          </SectionGroup>
        )}

        {activeTab === 'DIRECT' && dms.length > 0 && (
          <SectionGroup label="Direct Messages">
            {dms.map((c: ConversationItem) => (
              <ConvoCard key={c.id} convo={c} isActive={pathname.includes(c.id)} />
            ))}
          </SectionGroup>
        )}

        {activeTab === 'CHANNELS' && channels.length > 0 && (
          <SectionGroup label="Institute Channels">
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
    <div className="mt-3 mb-2">
      <p className="px-3 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/80">
        {label}
      </p>
      <div className="space-y-1">
        {children}
      </div>
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
  const hasUnread =
    convo.lastMessageAt != null &&
    (convo.lastReadAt == null ||
      new Date(convo.lastMessageAt) > new Date(convo.lastReadAt));

  return (
    <Link
      href={`/chat/${convo.id}`}
      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
        isActive
          ? "bg-white/80 border border-white shadow-sm ring-1 ring-amber-100 scale-[1.02] z-10 relative"
          : "hover:bg-white/50 border border-transparent hover:border-white/40 hover:shadow-sm"
      }`}
    >
      {/* Avatar */}
      <div className={`relative size-11 shrink-0 overflow-hidden rounded-full shadow-inner transition-transform group-hover:scale-105 ${isActive ? 'bg-amber-100 ring-2 ring-amber-200 ring-offset-1' : 'bg-white border border-white/60'}`}>
        {convo.displayImage ? (
          <Image
            src={convo.displayImage}
            alt=""
            fill
            className="object-cover"
          />
        ) : convo.type === "DIRECT" ? (
          <span className="flex h-full items-center justify-center text-sm font-extrabold text-slate-500 bg-gradient-to-br from-slate-100 to-slate-200">
            {(convo.displayName ?? "?").charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="flex h-full items-center justify-center text-base bg-gradient-to-br from-amber-50 to-orange-50">
            {convo.channelType === "ANNOUNCEMENTS" ? "📢" : "#"}
          </span>
        )}
        {hasUnread && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-rose-500 shadow-sm animate-pulse" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-1">
          <span
            className={`text-sm leading-tight line-clamp-2 break-words group-hover:text-amber-600 transition-colors ${hasUnread ? "font-extrabold text-slate-900" : "font-bold text-slate-700"}`}
          >
            {convo.displayName}
          </span>
          {hasUnread && (
            <span className="shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
              NEW
            </span>
          )}
        </div>
        {convo.lastMessage && (
          <p
            className={`truncate text-[11px] mt-1 ${hasUnread ? "text-slate-700 font-medium" : "text-slate-500"}`}
          >
            {convo.type !== "DIRECT" &&
              convo.lastMessage?.sender.name &&
              <span className="font-semibold text-slate-600">{convo.lastMessage.sender.name.split(" ")[0]}: </span>}
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
