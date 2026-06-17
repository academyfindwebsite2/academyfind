import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare, Building2, Eye, Calendar, User, Phone } from "lucide-react";

export default async function AdminCallbacksPage() {
  // Fetch all enquiries with the related institute details
  const callbacks = await prisma.instituteEnquiry.findMany({
    include: {
      institute: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-amber-500" /> All Institute Callbacks
          </h1>
          <p className="text-slate-500 mt-1">Manage and monitor all student enquiries across all institutes.</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-bold text-sm">
          Total Leads: {callbacks.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
              <tr>
                <th className="p-5">Date</th>
                <th className="p-5">Student Info</th>
                <th className="p-5">Target Institute</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {callbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                    No callbacks found in the system yet.
                  </td>
                </tr>
              ) : (
                callbacks.map((callback: any) => (
                  <tr key={callback.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {format(new Date(callback.createdAt), "dd MMM yyyy")}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400"/> {callback.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400"/>{callback.phone}</div>
                    </td>
                    <td className="p-5">
                      {/* 🚀 Clickable Institute Link */}
                      {callback.institute ? (
                        <Link 
                          href={`/af-ass-manage/institutes/${callback.institute.id}`}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold transition"
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{callback.institute.name}</span>
                        </Link>
                      ) : (
                        <span className="text-red-400 italic">Institute Deleted</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                        {callback.status || "NEW"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {/* 🚀 Detail Page Link */}
                      <Link href={`/af-ass-manage/instituteCallbacks/${callback.id}`}>
                        <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all shadow-xs cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}