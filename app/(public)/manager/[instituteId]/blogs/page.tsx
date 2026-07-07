import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PremiumLock } from "@/components/manager/PremiumLock";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Clock, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Manage Blogs | Manager Dashboard",
  robots: { index: false, follow: false },
};

function StatusBadge({ status }: { status: string }) {
  if (status === "PUBLISHED") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
        <CheckCircle2 className="h-3.5 w-3.5" /> Published
      </span>
    );
  }
  if (status === "PENDING_REVIEW") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
        <Clock className="h-3.5 w-3.5" /> Pending Review
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
        <XCircle className="h-3.5 w-3.5" /> Rejected
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800">
      <Clock className="h-3.5 w-3.5" /> {status}
    </span>
  );
}

export default async function ManagerBlogsPage(props: { params: Promise<{ instituteId: string }> }) {
  const { instituteId } = await props.params;

  const institute = await prisma.institute.findUnique({
    where: { id: instituteId },
    select: { subscriptionPlan: true },
  });

  if (!institute) {
    return <div>Institute not found.</div>;
  }

  const { subscriptionPlan } = institute;
  const isPremiumOrUltra = subscriptionPlan === "PREMIUM" || subscriptionPlan === "ULTRA";

  if (!isPremiumOrUltra) {
    return (
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Institute Blogs</h1>
        <PremiumLock
          title="Institute Blogs Locked"
          description="Upgrade to Premium or Ultra to write blogs for your institute. Share your insights, updates, and articles directly with the student community."
          instituteId={instituteId}
        />
      </div>
    );
  }

  const blogs = await prisma.blogPost.findMany({
    where: { relatedInstituteId: instituteId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
      coverImage: true,
      rejectionReason: true,
      viewCount: true,
    },
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Institute Blogs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Write and manage blogs to showcase your institute's expertise.
          </p>
        </div>
        <Button asChild className="bg-amber-500 font-bold text-white hover:bg-amber-600 rounded-xl">
          <Link href={`/manager/${instituteId}/blogs/write`}>
            <Plus className="mr-2 h-4 w-4" />
            Write New Blog
          </Link>
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">No blogs yet</h3>
          <p className="mb-6 max-w-md text-slate-500">
            You haven't written any blogs for this institute. Start sharing your knowledge to attract more students!
          </p>
          <Button asChild className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl">
            <Link href={`/manager/${instituteId}/blogs/write`}>Create First Blog</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs transition-all hover:shadow-md hover:border-slate-200"
            >
              <div className="relative aspect-video w-full bg-slate-100">
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                    No Cover Image
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <StatusBadge status={blog.status} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 line-clamp-2 font-bold leading-snug text-slate-900">
                  {blog.title}
                </h3>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    {blog.viewCount} views
                  </span>
                </div>

                {blog.status === "REJECTED" && blog.rejectionReason && (
                  <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                    <span className="font-bold">Reason:</span> {blog.rejectionReason}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 font-bold"
                  >
                    <Link href={`/manager/${instituteId}/blogs/edit/${blog.id}`}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
