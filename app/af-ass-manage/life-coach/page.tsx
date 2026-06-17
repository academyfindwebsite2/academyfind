import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Phone, Mail, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

export default async function AdminLifeCoachLeadsPage() {
  const requests = await prisma.lifeCoachRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Life Coach Requests</h1>
          <p className="text-sm text-slate-500">Manage and follow up with students who need mentorship.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Student Name</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">No counseling requests found yet.</td>
              </tr>
            ) : (
              requests.map((req: any) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{req.fullName}</td>
                  <td className="p-4 text-sm text-slate-600 space-y-1">
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {req.phone}</div>
                    <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {req.email}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      req.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      req.status === "CONTACTED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/af-ass-manage/life-coach/${req.id}`}>
                      <button className="inline-flex items-center justify-center p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors">
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
  );
}