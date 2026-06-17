import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { User, Phone, Mail, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import StatusUpdater from "@/components/admin/AdminLifeCoachStatusUpdater";

export default async function LifeCoachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const request = await prisma.lifeCoachRequest.findUnique({
    where: { id },
  });

  if (!request) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 font-sans">
      <Link href="/af-ass-manage/life-coach" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-purple-600 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        
        {/* Header & Status Updater */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Counseling Request</h1>
            <p className="text-sm text-slate-500 font-mono mt-1">ID: {request.id}</p>
          </div>
          
          <StatusUpdater requestId={request.id} currentStatus={request.status as any} />
        </div>

        {/* Lead Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Information</h3>
            
            <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-xs"><User className="w-4 h-4 text-purple-600" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Full Name</p>
                  <p className="font-semibold text-slate-800">{request.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-xs"><Phone className="w-4 h-4 text-emerald-600" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                  <a href={`tel:${request.phone}`} className="font-semibold text-emerald-700 hover:underline">{request.phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-xs"><Mail className="w-4 h-4 text-blue-600" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                  <a href={`mailto:${request.email}`} className="font-semibold text-blue-700 hover:underline">{request.email}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Query Details</h3>
            
            <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100 h-full">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-900 text-sm">Message / Dilemma</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {request.message || <span className="italic text-slate-400">No specific message provided. Please call to ask.</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Requested on {new Date(request.createdAt).toLocaleString()}
        </div>

      </div>
    </div>
  );
}