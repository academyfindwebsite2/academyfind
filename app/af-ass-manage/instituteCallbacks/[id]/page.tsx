import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Building2, Calendar, Mail, MessageSquare, Phone, User } from "lucide-react";

export default async function AdminCallbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const callback = await prisma.instituteEnquiry.findUnique({
    where: { id },
    include: {
      institute: true, // Need institute details
    }
  });

  if (!callback) return notFound();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      {/* 🚀 Back Button */}
      <Link href="/af-ass-manage/instituteCallbacks" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Callbacks
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="flex justify-between items-start pb-6 border-b border-slate-100 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-6 h-6 text-slate-400" /> {callback.name}
            </h1>
            <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Status: {callback.status || "NEW"}
            </span>
          </div>
          <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <Calendar className="w-4 h-4" /> {format(new Date(callback.createdAt), "PPP 'at' p")}
          </div>
        </div>

        {/* 🚀 Target Institute Link Card */}
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
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-700 leading-relaxed shadow-inner flex gap-3">
          <MessageSquare className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          {callback.message ? (
            <p className="whitespace-pre-wrap">{callback.message}</p>
          ) : (
            <p className="text-slate-400 italic">No custom message was provided by the student.</p>
          )}
        </div>

      </div>
    </div>
  );
}