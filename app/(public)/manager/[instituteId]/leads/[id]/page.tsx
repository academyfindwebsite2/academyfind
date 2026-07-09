import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Mail, Phone, Calendar, ArrowLeft, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { formatIST } from "@/lib/utils";

export default async function LeadDetailedPage({ params }: { params: Promise<{ id: string; instituteId: string }> }) {
    const { id, instituteId } = await params;

    const enquiry = await prisma.instituteEnquiry.findUnique({
        where: { id }
    });

    if (!enquiry) return notFound();

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* 🚀 Back Button */}
            <Link href={`/manager/${instituteId}/leads`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Leads
            </Link>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                            {enquiry.name}
                        </h1>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Status: {enquiry.status}
                        </span>
                    </div>
                    <div className="text-right text-sm text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatIST(enquiry.createdAt, "PPP 'at' p")}
                    </div>
                </div>

                {/* 🚀 Contact Details */}
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <a href={`tel:${enquiry.phone}`} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition group">
                        <div className="p-2.5 bg-white rounded-xl shadow-xs text-emerald-500 group-hover:scale-110 transition"><Phone className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Mobile Number</p>
                            <p className="font-semibold text-slate-800">{enquiry.phone}</p>
                        </div>
                    </a>
                </div>

                {/* 🚀 Message Content */}
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Student Query</h3>
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-amber-900 leading-relaxed">
                    {enquiry.message ? (
                        <p className="whitespace-pre-wrap">{enquiry.message}</p>
                    ) : (
                        <p className="text-amber-700/60 italic">No specific message was provided by the student. They just requested a callback/contact.</p>
                    )}
                </div>
            </div>
        </div>
    );
}