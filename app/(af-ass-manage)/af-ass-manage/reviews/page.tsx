import { ReviewStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { approveReview, rejectReview } from "@/lib/User/admin/adminReview";
import { CheckCircle, XCircle, Star, MessageSquare, Filter } from "lucide-react";
import Link from "next/link";

// Server Component: Database se reviews fetch karega
export default async function AdminReviewsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  const currentFilter = params.status || 'PENDING';

  // Build filter condition
  const whereCondition: any = {};
  if (currentFilter !== 'ALL') {
    whereCondition.status = currentFilter as ReviewStatus;
  }

  const reviews = await prisma.review.findMany({
    where: whereCondition,
    include: {
      user: { select: { name: true, email: true } },
      institute: { select: { name: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const filterOptions = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Review Moderation</h1>
            <p className="text-sm text-slate-500">Manage student reviews across academies. (Showing: {currentFilter})</p>
          </div>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-bold text-sm shrink-0">
          Total: {reviews.length}
        </div>
      </div>

      {/* 🚀 Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5 mr-2">
          <Filter className="w-4 h-4" /> Filter:
        </div>
        {filterOptions.map((opt: any) => (
          <Link 
            key={opt.value}
            href={`/af-ass-manage/reviews?status=${opt.value}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              currentFilter === opt.value 
              ? "bg-slate-800 text-white shadow-sm" 
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center shadow-sm mt-4">
          <MessageSquare className="h-16 w-16 text-slate-200 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">All caught up!</h3>
          <p className="text-slate-500">No {currentFilter.toLowerCase()} reviews found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
                  <th className="p-4">User</th>
                  <th className="p-4">Institute</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 w-1/3">Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reviews.map((review: any) => (
                  <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* User Info */}
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{review.user?.name || "Anonymous"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{review.user?.email || "No Email"}</p>
                    </td>

                    {/* Institute Info */}
                    <td className="p-4">
                      <p className="font-semibold text-blue-600 hover:underline cursor-pointer">
                        <Link href={`/af-ass-manage/institutes/${review.institute.id}`}>
                          {review.institute.name}
                        </Link>
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-700 w-max px-2.5 py-1 rounded-lg">
                        <span className="font-extrabold text-sm">{review.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="p-4">
                      <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-2">
                        {review.comment || <span className="italic text-slate-400">No comment provided</span>}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                        review.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        review.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {review.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      {review.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          {/* Approve Button */}
                          <form action={async () => {
                            "use server";
                            await approveReview(review.id, review.institute.id);
                          }}>
                            <button 
                              type="submit"
                              title="Approve"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold"
                            >
                              <CheckCircle className="h-4 w-4" /> Approve
                            </button>
                          </form>

                          {/* Reject Button */}
                          <form action={async () => {
                            "use server";
                            await rejectReview(review.id);
                          }}>
                            <button 
                              type="submit"
                              title="Reject"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all text-xs font-bold"
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          Processed
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}