import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Building2, Calendar, MessageSquare, Phone, User, History, Zap, Star, BadgeCheck } from "lucide-react";
import CallbackControls from "@/components/admin/AdminCallbackControls";
import LeadDistributionForm from "@/components/admin/AdminLeadDistributionFor";

const PLAN_CONFIG = {
  ULTRA:    { label: "Ultra",    icon: Zap,        badgeClass: "bg-purple-100 text-purple-700" },
  PREMIUM:  { label: "Premium",  icon: Star,       badgeClass: "bg-blue-100 text-blue-700" },
  VERIFIED: { label: "Verified", icon: BadgeCheck, badgeClass: "bg-emerald-100 text-emerald-700" },
  BASIC:    { label: "Basic",    icon: Building2,  badgeClass: "bg-slate-100 text-slate-700" },
};

export default async function AdminCallbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const callback = await prisma.instituteEnquiry.findUnique({
    where: { id },
    include: {
      institute: true,
      distributionLogs: {
        include: { admin: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!callback) return notFound();

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      <Link href="/af-ass-manage/instituteCallbacks" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Callbacks
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-slate-100 mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-6 h-6 text-slate-400" /> {callback.name}
            </h1>
            <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 mt-3 rounded-xl border border-slate-100 w-fit">
              <Calendar className="w-4 h-4" /> {format(new Date(callback.createdAt), "PPP 'at' p")}
            </div>
          </div>
          
          {/* Controls Component */}
          <div className="shrink-0">
             <CallbackControls id={callback.id} currentStatus={callback.status} />
          </div>
        </div>

        {/* Target Institute Link Card */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Enquired For</h3>
          {callback.institute ? (
            <Link 
              href={`/af-ass-manage/institutes/${callback.institute.id}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 hover:border-amber-300 transition group"
            >
              <div className="p-3 bg-white rounded-xl shadow-xs text-amber-500 group-hover:scale-105 transition">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-amber-700 transition">{callback.institute.name}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  Click to view institute profile in admin panel &rarr;
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-medium">
              The target institute has been deleted from the database.
            </div>
          )}
        </div>

        {/* Contact Details Grid */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Student Contact Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <a href={`tel:${callback.phone}`} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition group">
            <div className="p-2.5 bg-white rounded-xl shadow-xs text-emerald-500"><Phone className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">Mobile Number</p>
              <p className="font-semibold text-slate-800">{callback.phone}</p>
            </div>
          </a>
        </div>

        {/* Message Box */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Student Message</h3>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-700 leading-relaxed shadow-inner flex gap-3 mb-8">
          <MessageSquare className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          {callback.message ? (
            <p className="whitespace-pre-wrap">{callback.message}</p>
          ) : (
            <p className="text-slate-400 italic">No custom message was provided by the student.</p>
          )}
        </div>

        {/* 🚀 Distribution History */}
        {callback.distributionLogs && callback.distributionLogs.length > 0 && (
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" /> Distribution History
            </h3>
            
            <div className="space-y-3">
              {callback.distributionLogs.map((log: any, idx: number) => {
                const bulkFilters = typeof log.bulkFilters === 'string' ? JSON.parse(log.bulkFilters) : log.bulkFilters;
                const isIndividual = log.mode === 'individual';

                return (
                  <div key={log.id} className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-2xl p-4 hover:border-slate-200 transition">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {isIndividual ? '👤 Individual Selection' : '📊 Bulk Distribution'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          By <b>{log.admin?.name || log.admin?.email || 'Unknown'}</b> • {format(new Date(log.createdAt), "PPP 'at' p")}
                        </p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {log.targetCount} Institutes
                      </span>
                    </div>

                    {!isIndividual && bulkFilters && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-600 bg-white rounded-lg p-3 border border-slate-100">
                        {bulkFilters.plansAll ? (
                          <div><b>Plans:</b> All Plans</div>
                        ) : bulkFilters.plans?.length > 0 ? (
                          <div><b>Plans:</b> {bulkFilters.plans.join(', ')}</div>
                        ) : null}

                        {bulkFilters.citiesAll ? (
                          <div><b>Cities:</b> All Cities</div>
                        ) : bulkFilters.cityIds?.length > 0 ? (
                          <div><b>Cities:</b> {bulkFilters.cityIds.length} selected</div>
                        ) : null}

                        {bulkFilters.categoriesAll ? (
                          <div><b>Categories:</b> All Categories</div>
                        ) : bulkFilters.categoryIds?.length > 0 ? (
                          <div><b>Categories:</b> {bulkFilters.categoryIds.length} selected</div>
                        ) : null}

                        {bulkFilters.search && (
                          <div><b>Search:</b> "{bulkFilters.search}"</div>
                        )}
                      </div>
                    )}

                    {log.adminNote && (
                      <div className="mt-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                        <b>Note:</b> {log.adminNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 🚀 LEAD DISTRIBUTION FORM */}
      <LeadDistributionForm
        enquiryId={callback.id} 
        originalInstituteId={callback.instituteId} 
        studentName={callback.name} 
      />
    </div>
  );
}