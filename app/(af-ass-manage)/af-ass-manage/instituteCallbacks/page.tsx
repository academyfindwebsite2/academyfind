import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare, Building2, Eye, Calendar, User, Phone, Filter } from "lucide-react";

export default async function AdminCallbacksPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  const currentFilter = params.status || 'ALL';

  // 🚀 Sirf Original Leads dikhani hain Admin ko, copies nahi!
  const whereCondition: any = {
      isForwarded: false 
  };
  
  if (currentFilter !== 'ALL') {
    if (currentFilter.startsWith('ASSIGNED_TO_')) {
       // Optional logic here
    } else {
      whereCondition.status = currentFilter;
    }
  }

  // Fetch callbacks based on filter
  const callbacks = await prisma.instituteEnquiry.findMany({
    where: whereCondition,
    include: {
      institute: {
        select: {
          id: true,
          name: true,
        }
      },
      // 🚀 BONUS: Hum ye count bhi manga lete hain taaki table me dikha sakein
      // ki kya ye admin ne aage kisi ko distribute/sell kari hai ya nahi.
      // (Agar iska koi child hoga matlab ye distribute hui hai)
      // _count: {
      //     select: {
      //         // Prisma mein self-relation array ko access karne ke liye relation name chahiye
      //         // Iske liye schema mein `children InstituteEnquiry[] @relation("ForwardedLeads")` type add karna hota hai.
      //         // Abhi simple rakhte hain, hum detail page pe check karenge.
      //     }
      // }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Filter options array
  const filterOptions = [
    { label: "All", value: "ALL" },
    { label: "New", value: "NEW" },
    { label: "Messaged", value: "MESSAGED" },
    { label: "Called", value: "CALLED" },
    { label: "DNP (Did Not Pick)", value: "DNP" },
    { label: "Junk", value: "JUNK" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-amber-500" /> Original Callbacks
          </h1>
          <p className="text-slate-500 mt-1">Manage and monitor root student enquiries. (Showing: {currentFilter})</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl font-bold text-sm shrink-0">
          Total Leads: {callbacks.length}
        </div>
      </div>

      {/* 🚀 Simple Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5 mr-2">
          <Filter className="w-4 h-4" /> Filter:
        </div>
        {filterOptions.map((opt: any) => (
          <Link 
            key={opt.value}
            href={`/af-ass-manage/instituteCallbacks?status=${opt.value}`}
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
              <tr>
                <th className="p-5">Date</th>
                <th className="p-5">Student Info</th>
                <th className="p-5">Original Target Institute</th>
                <th className="p-5">Admin Status</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {callbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                    No callbacks found for "{currentFilter}".
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
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider
                        ${callback.status === 'NEW' ? 'bg-blue-100 text-blue-700' : ''}
                        ${callback.status === 'MESSAGED' ? 'bg-purple-100 text-purple-700' : ''}
                        ${callback.status === 'CALLED' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${callback.status === 'DNP' ? 'bg-orange-100 text-orange-700' : ''}
                        ${callback.status === 'JUNK' ? 'bg-red-100 text-red-700' : ''}
                        ${!['NEW', 'MESSAGED', 'CALLED', 'DNP', 'JUNK'].includes(callback.status) ? 'bg-slate-100 text-slate-700' : ''}
                      `}>
                        {callback.status || "NEW"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
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