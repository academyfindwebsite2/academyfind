"use client";

import {
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  CheckCheck,
  ChevronDown,
  Loader2,
  MoreVertical,
  Pin,
  Send,
  Smile,
  Trash2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";

import { sendMessage, deleteMessage, addReaction, reportMessage } from "@/app/(app)/chat/actions";
import { ChatInfoSidebar } from "@/app/(app)/chat/components/ChatInfoSidebar";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const POLL_INTERVAL = 5000; // 5 seconds

interface Message {
  id: string;
  content: string | null;
  type: string;
  isEdited: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  replyToId: string | null;
  replyTo: { id: string; content: string | null; sender: { name: string | null } } | null;
  sender: { id: string; name: string | null; username: string | null; image: string | null };
  reactions: { id: string; emoji: string; userId: string; user: { name: string | null } }[];
  attachments: { id: string; fileUrl: string; fileName: string; mimeType: string; size: number }[];
}

interface ConversationMeta {
  id: string;
  type: string;
  title: string | null;
  channelType: string | null;
  isReadOnly: boolean;
  memberCount: number;
  institute: { id: string; name: string; logo: string | null; slug: string } | null;
  participants: { user: { id: string; name: string | null; username: string | null; image: string | null } }[];
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "🔥", "✅"];

export function MessageWindow({
  conversationId,
  currentUserId,
}: {
  conversationId: string;
  currentUserId: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: metaData } = useSWR<{ conversation: ConversationMeta }>(
    `/api/v2/conversations/${conversationId}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const { data, mutate: mutateMessages } = useSWR<{
    messages: Message[];
    nextCursor: string | null;
  }>(`/api/v2/conversations/${conversationId}/messages`, fetcher, {
    refreshInterval: POLL_INTERVAL,
  });

  const meta = metaData?.conversation;
  const messages = data?.messages ?? [];

  // Auto scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowScrollBtn(true);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 300);
  };

  const handleSend = async () => {
    if (!content.trim() || sending) return;
    setSending(true);

    const fd = new FormData();
    fd.append("content", content.trim());
    if (replyTo) fd.append("replyToId", replyTo.id);

    const result = await sendMessage(conversationId, fd);
    if (result.success) {
      setContent("");
      setReplyTo(null);
      await mutateMessages();
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (msgId: string) => {
    await deleteMessage(msgId);
    mutateMessages();
  };

  const handleReaction = async (msgId: string, emoji: string) => {
    await addReaction(msgId, emoji);
    mutateMessages();
  };

  const handleReport = async (msgId: string) => {
    await reportMessage(msgId, "SPAM");
  };

  // ── Render ──────────────────────────────────────────────
  const otherParticipant = meta?.participants?.find(p => p.user.id !== currentUserId) ?? meta?.participants?.[0];

  const headerTitle =
    meta?.type === "DIRECT"
      ? (otherParticipant?.user.name ?? "Direct Message")
      : (meta?.institute?.name ?? meta?.title ?? `#${meta?.channelType?.toLowerCase() ?? "channel"}`);

  const headerSub =
    meta?.type === "DIRECT"
      ? `@${otherParticipant?.user.username}`
      : `${meta?.memberCount ?? 0} members`;

  const headerImg =
    meta?.type === "DIRECT"
      ? (otherParticipant?.user.image ?? null)
      : (meta?.institute?.logo ?? null);

  const isReadOnly = meta?.isReadOnly ?? false;

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <Link href="/chat" className="text-slate-400 hover:text-slate-700 lg:hidden">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-slate-100">
          {headerImg ? (
            <Image src={headerImg} alt="" fill className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
              {(headerTitle ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900">{headerTitle}</p>
          <p className="text-xs text-slate-400">{headerSub}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            {meta?.type !== "DIRECT" && meta?.institute && (
            <Link
                href={`/institute/${meta.institute.id}-${meta.institute.slug}`}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 hidden sm:block"
            >
                View Institute →
            </Link>
            )}
            <ChatInfoSidebar conversationId={conversationId} meta={meta} />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto bg-slate-50/50 px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No messages yet. Say hello! 👋
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg, i) => {
              const prev = messages[i - 1];
              const isSameUser = prev?.sender.id === msg.sender.id;
              const showDate =
                !prev ||
                new Date(msg.createdAt).toDateString() !==
                  new Date(prev.createdAt).toDateString();
              const isMine = msg.sender.id === currentUserId;

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
                      <div className="h-px flex-1 bg-slate-200" />
                      {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                  )}
                  <MessageBubble
                    msg={msg}
                    isMine={isMine}
                    isSameUser={isSameUser && !showDate}
                    currentUserId={currentUserId}
                    onReply={() => setReplyTo(msg)}
                    onDelete={() => handleDelete(msg.id)}
                    onReaction={(emoji) => handleReaction(msg.id, emoji)}
                    onReport={() => handleReport(msg.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div ref={bottomRef} />

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="sticky bottom-4 float-right rounded-full border border-slate-200 bg-white p-2 shadow-lg"
          >
            <ChevronDown className="size-4 text-slate-600" />
          </button>
        )}
      </div>

      {/* Input bar */}
      {!isReadOnly ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          {/* Reply preview */}
          {replyTo && (
            <div className="mb-2 flex items-start gap-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-xs">
              <div className="flex-1 truncate">
                <span className="font-semibold text-amber-700">
                  Replying to {replyTo.sender.name}
                </span>
                <p className="truncate text-slate-500">{replyTo.content}</p>
              </div>
              <button type="button" onClick={() => setReplyTo(null)} className="text-slate-400">
                ✕
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-300 focus:bg-white focus:outline-none max-h-32 overflow-y-auto"
              style={{ height: "auto" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 128) + "px";
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!content.trim() || sending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-900 hover:bg-amber-500 disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-400">
          🔒 This channel is read-only.
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  msg,
  isMine,
  isSameUser,
  currentUserId,
  onReply,
  onDelete,
  onReaction,
  onReport,
}: {
  msg: Message;
  isMine: boolean;
  isSameUser: boolean;
  currentUserId: string;
  onReply: () => void;
  onDelete: () => void;
  onReaction: (emoji: string) => void;
  onReport: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const isDeleted = msg.content === "[Message deleted]";

  return (
    <div
      className={`group flex gap-2 ${isMine ? "flex-row-reverse" : ""} ${
        isSameUser ? "mt-0.5" : "mt-3"
      }`}
    >
      {/* Avatar */}
      {!isSameUser ? (
        <div className={`relative size-8 shrink-0 overflow-hidden rounded-full bg-slate-100 mt-1 ${isMine ? "hidden" : ""}`}>
          {msg.sender.image ? (
            <Image src={msg.sender.image} alt="" fill className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
              {(msg.sender.name ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      ) : (
        <div className="w-8 shrink-0" />
      )}

      <div className={`max-w-[65%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
        {/* Name + time */}
        {!isSameUser && !isMine && (
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {msg.sender.name ?? msg.sender.username}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Reply preview */}
        {msg.replyTo && (
          <div className="mb-1 rounded-lg border-l-4 border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-500">
            <span className="font-semibold">{msg.replyTo.sender.name}: </span>
            {msg.replyTo.content?.slice(0, 80)}
          </div>
        )}

        {/* Bubble */}
        <div className="relative group/bubble">
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm ${
              isDeleted
                ? "bg-slate-100 text-slate-400 italic"
                : isMine
                ? "bg-amber-400 text-slate-900"
                : "bg-white border border-slate-200 text-slate-900"
            }`}
          >
            {msg.content}
            {msg.isEdited && !isDeleted && (
              <span className="ml-2 text-[10px] opacity-60">(edited)</span>
            )}
          </div>

          {/* Hover actions */}
          {!isDeleted && (
            <div
              className={`absolute top-0 ${isMine ? "-left-24" : "-right-24"} hidden group-hover/bubble:flex items-center gap-1 rounded-xl border border-slate-200 bg-white shadow-sm px-2 py-1`}
            >
              {/* Emoji picker toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowReactions((v) => !v)}
                  className="text-slate-400 hover:text-amber-600 p-0.5"
                >
                  <Smile className="size-4" />
                </button>
                {showReactions && (
                  <div className="absolute bottom-8 left-0 flex gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-10">
                    {QUICK_REACTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => { onReaction(e); setShowReactions(false); }}
                        className="text-base hover:scale-125 transition-transform"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onReply}
                className="text-slate-400 hover:text-blue-600 p-0.5 text-xs"
                title="Reply"
              >
                ↩
              </button>
              {isMine && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="text-slate-400 hover:text-rose-500 p-0.5"
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
              {!isMine && (
                <button
                  type="button"
                  onClick={onReport}
                  className="text-slate-400 hover:text-rose-500 p-0.5"
                  title="Report"
                >
                  <AlertTriangle className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(
              msg.reactions.reduce(
                (acc, r) => {
                  acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            ).map(([emoji, count]) => {
              const reacted = msg.reactions.some(
                (r) => r.emoji === emoji && r.userId === currentUserId,
              );
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReaction(emoji)}
                  className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs ${
                    reacted
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {emoji} {count}
                </button>
              );
            })}
          </div>
        )}

        {/* Time for own messages */}
        {isMine && !isSameUser && (
          <span className="mt-1 text-[10px] text-slate-400">
            {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
