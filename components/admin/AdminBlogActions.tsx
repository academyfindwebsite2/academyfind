"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Archive, ExternalLink, Loader2, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  archiveAdminBlogPost,
  deleteAdminBlogPost,
} from "@/lib/User/admin/admin-blog";

export default function AdminBlogActions({
  postId,
  slug,
  isArchived,
}: {
  postId: string;
  slug: string;
  isArchived: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const archive = () => {
    startTransition(async () => {
      const result = await archiveAdminBlogPost(postId);
      if (!result.success) {
        toast.error(result.error ?? "Unable to archive this post.");
        return;
      }
      toast.success("Post archived.");
      router.refresh();
    });
  };

  const remove = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminBlogPost(postId);
      if (!result.success) {
        toast.error(result.error ?? "Unable to delete this post.");
        setConfirmingDelete(false);
        return;
      }
      toast.success("Post permanently deleted.");
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild type="button" variant="ghost" size="icon-sm">
        <Link href={`/blog/${slug}`} target="_blank" aria-label="View post">
          <ExternalLink />
        </Link>
      </Button>
      <Button asChild type="button" variant="ghost" size="icon-sm">
        <Link
          href={`/af-ass-manage/blog/edit/${postId}`}
          aria-label="Edit post"
        >
          <Pencil />
        </Link>
      </Button>
      {!isArchived ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isPending}
          onClick={archive}
          aria-label="Archive post"
          className="text-slate-500 hover:text-amber-700"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Archive />}
        </Button>
      ) : null}
      <Button
        type="button"
        variant={confirmingDelete ? "destructive" : "ghost"}
        size={confirmingDelete ? "sm" : "icon-sm"}
        disabled={isPending}
        onClick={remove}
        onBlur={() => setConfirmingDelete(false)}
        aria-label={confirmingDelete ? "Confirm delete" : "Delete post"}
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Trash2 />
        )}
        {confirmingDelete ? "Confirm" : null}
      </Button>
    </div>
  );
}
