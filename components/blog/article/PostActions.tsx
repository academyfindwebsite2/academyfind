"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Bookmark, MessageSquare, ThumbsUp, Share2, Flag, AlertTriangle, Heart } from "lucide-react";
import toast from "react-hot-toast";

// Actions
import { ReportReason } from "@/app/generated/prisma/client";
import { reportPost } from "@/lib/User/user/blog/report";
import { toggleBookmark } from "@/lib/User/user/blog/togglebookmark";
import { toggleReaction } from "@/lib/User/user/blog/reaction";

interface ArticleActionsProps {
  postId: string;
  slug: string;
  initialLikes: number;
  initialBookmarks: number;
  initialComments: number;
  hasLikedInitially: boolean;
  hasBookmarkedInitially: boolean;
  hasHelpfullyInitially: boolean;
  hasLovedInitially: boolean;
  isLoggedIn: boolean;
}

export default function ArticleActions({
  postId,
  slug,
  initialLikes,
  initialBookmarks,
  initialComments,
  hasLikedInitially,
  hasHelpfullyInitially,
  hasLovedInitially,
  hasBookmarkedInitially,
  isLoggedIn,
}: ArticleActionsProps) {
  
  const [isPending, startTransition] = useTransition();

  const initialReaction: "LIKE" | "HELPFUL" | "LOVE" | null = 
    hasLikedInitially ? "LIKE" :
    hasHelpfullyInitially ? "HELPFUL" :
    hasLovedInitially ? "LOVE" : null;

  // Single optimistic reaction state combining count and current reaction type
  const [optimisticReaction, addOptimisticReaction] = useOptimistic(
    { count: initialLikes, userReaction: initialReaction },
    (state, action: { type: "LIKE" | "HELPFUL" | "LOVE"; toggle: boolean }) => {
      const { type, toggle } = action;
      
      if (toggle) {
        // Toggle OFF current reaction
        if (state.userReaction === type) {
          return {
            count: Math.max(0, state.count - 1),
            userReaction: null
          };
        }
        // Toggle ON or Switch reaction type (total count only changes by 1 if there was no reaction before)
        const countDiff = state.userReaction ? 0 : 1;
        return {
          count: state.count + countDiff,
          userReaction: type
        };
      } else {
        // Explicit removal
        const countDiff = state.userReaction ? -1 : 0;
        return {
          count: Math.max(0, state.count + countDiff),
          userReaction: null
        };
      }
    }
  );

  // Optimistic UI for Bookmarks
  const [optimisticBookmark, addOptimisticBookmark] = useOptimistic(
    { count: initialBookmarks, hasBookmarked: hasBookmarkedInitially },
    (state, newBookmarkState: boolean) => ({
      count: newBookmarkState ? state.count + 1 : state.count - 1,
      hasBookmarked: newBookmarkState,
    })
  );

  // Report Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>("SPAM");
  const [reportMessage, setReportMessage] = useState("");

  const handleLike = () => {
    if (!isLoggedIn) return toast.error("Please login to like this article.");
    
    startTransition(async () => {
      addOptimisticReaction({ type: "LIKE", toggle: true });
      
      const res = await toggleReaction(postId, slug, "LIKE");
      if (!res.success) {
        toast.error(res.message || "Failed to update reaction.");
      }
    });
  };

  const handleHelpful = () => {
    if (!isLoggedIn) return toast.error("Please login to mark as helpful.");

    startTransition(async () => {
      addOptimisticReaction({ type: "HELPFUL", toggle: true });

      const res = await toggleReaction(postId, slug, "HELPFUL");
      if (!res.success) {
        toast.error(res.message || "Failed to update reaction.");
      }
    });
  };

  const handleLoved = () => {
    if (!isLoggedIn) return toast.error("Please login to mark as loved.");
    
    startTransition(async () => {
      addOptimisticReaction({ type: "LOVE", toggle: true });

      const res = await toggleReaction(postId, slug, "LOVE");
      if (!res.success) {
        toast.error(res.message || "Failed to update reaction.");
      }
    });
  };

  const handleBookmark = () => {
    if (!isLoggedIn) return toast.error("Please login to save this article.");
    
    startTransition(async () => {
      const newStatus = !optimisticBookmark.hasBookmarked;
      addOptimisticBookmark(newStatus);
      
      const res = await toggleBookmark(postId);
      if (!res.success) {
        toast.error(res.message || "Failed to update bookmark.");
      } else {
        toast.success(newStatus ? "Article saved to bookmarks!" : "Removed from bookmarks");
      }
    });
  };

  const submitReport = async () => {
    if (!isLoggedIn) return toast.error("Please login to report.");
    
    startTransition(async () => {
      const res = await reportPost({ postId, reason: reportReason, message: reportMessage });
      if (res.success) {
        toast.success(res.message);
        setIsReportOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-4 border-y border-slate-200 my-8">
        {/* Left: Engagement */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center gap-2 transition-colors ${optimisticReaction.userReaction === "LIKE" ? 'text-amber-600' : 'text-slate-500 hover:text-amber-600'}`}
          >
            <ThumbsUp className={`w-5 h-5 ${optimisticReaction.userReaction === "LIKE" ? 'fill-amber-500' : ''}`} />
            <span className="text-sm font-semibold">{optimisticReaction.count}</span>
          </button>
          
          <button 
            onClick={handleHelpful}
            disabled={isPending}
            className={`flex items-center gap-2 transition-colors ${optimisticReaction.userReaction === "HELPFUL" ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
          >
            <ThumbsUp className={`w-5 h-5 ${optimisticReaction.userReaction === "HELPFUL" ? 'fill-emerald-500' : ''}`} />
            <span className="text-sm font-semibold">{optimisticReaction.count}</span>
          </button>

          <button 
            onClick={handleLoved}
            disabled={isPending}
            className={`flex items-center gap-2 transition-colors ${optimisticReaction.userReaction === "LOVE" ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}
          >
            <Heart className={`w-5 h-5 ${optimisticReaction.userReaction === "LOVE" ? 'fill-rose-500' : ''}`} />
            <span className="text-sm font-semibold">{optimisticReaction.count}</span>
          </button>

          <button 
            onClick={scrollToComments}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-semibold">{initialComments}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBookmark}
            disabled={isPending}
            className={`flex items-center gap-2 transition-colors ${optimisticBookmark.hasBookmarked ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
          >
            <Bookmark className={`w-5 h-5 ${optimisticBookmark.hasBookmarked ? 'fill-emerald-500' : ''}`} />
          </button>

          <div className="w-px h-6 bg-slate-200" />

          <button 
            onClick={() => setIsReportOpen(true)}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Report this article"
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Simple Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500"/> Report Article
            </h3>
            
            <select 
              value={reportReason} 
              onChange={(e) => setReportReason(e.target.value as ReportReason)}
              className="w-full mb-4 p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="SPAM">It's spam or promotional</option>
              <option value="MISINFORMATION">Contains false information</option>
              <option value="COPYRIGHT">Copyright infringement</option>
              <option value="OFFENSIVE">Offensive or abusive</option>
              <option value="OTHER">Other reason</option>
            </select>

            <textarea 
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              placeholder="Additional details (optional)..."
              className="w-full h-24 mb-4 p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />

            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsReportOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100">Cancel</button>
              <button 
                onClick={submitReport} 
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition disabled:opacity-50"
              >
                {isPending ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}