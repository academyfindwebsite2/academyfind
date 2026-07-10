"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getOrJoinBatchConversation } from "@/app/(public)/institute/[idSlug]/actions";

export function OpenBatchChatButton({
  instituteId,
  batchId,
  batchName,
}: {
  instituteId: string;
  batchId: string;
  batchName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOpenChat = async () => {
    setLoading(true);
    try {
      const res = await getOrJoinBatchConversation(instituteId, batchId, batchName);
      if (res.success && res.conversationId) {
        router.push(`/chat/${res.conversationId}`);
      } else {
        toast.error(res.message || "Could not open chat");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleOpenChat}
      disabled={loading}
      size="sm"
      variant="default"
      className="bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs font-semibold px-3 flex items-center gap-2"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
      Open Chat
    </Button>
  );
}
