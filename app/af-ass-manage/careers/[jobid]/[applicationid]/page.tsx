import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, ExternalLink, FileText, User } from "lucide-react";
import ApplicationStatusForm from "@/components/admin/adminApplicationFormStatus";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ jobid: string, applicationid: string }>}) {
    const { jobid, applicationid } = await params;
    const app = await prisma.jobApplication.findUnique({
        where: { id: applicationid },
        include: { job: true }
    });

    if (!app) return notFound();

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
            <Link href={`/af-ass-manage/careers/${jobid}`} className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-purple-600 transition">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Candidates List
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* LEFT SIDE: Candidate Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-5">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">{app.name}</h1>
                            <p className="text-sm font-semibold text-slate-500 mt-1">Applying for: <span className="text-purple-600">{app.job.title}</span></p>
                            
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600 font-medium">
                                <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 hover:text-purple-600"><Mail className="w-4 h-4"/> {app.email}</a>
                                <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 hover:text-purple-600"><Phone className="w-4 h-4"/> {app.phone}</a>
                            </div>

                            <div className="flex gap-3 mt-4">
                                {app.linkedinUrl && (
                                    <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-[#0077b5]/10 text-[#0077b5] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0077b5]/20 transition">
                                        LinkedIn Profile <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                {app.portfolioUrl && (
                                    <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition">
                                        Portfolio Web <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2">Cover Letter</h3>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {app.coverLetter || <span className="italic text-slate-400">No cover letter provided by the candidate.</span>}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b pb-2">Attached Resume</h3>
                            <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between w-full max-w-sm p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-red-50 text-red-500 rounded-lg"><FileText className="w-6 h-6"/></div>
                                    <div className="truncate">
                                        <p className="text-sm font-bold text-slate-800 truncate">{app.resumeFileName || "Candidate_Resume.pdf"}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Click to view/download</p>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-purple-600 shrink-0" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Application ATS Controls */}
                <div className="md:col-span-1">
                    <ApplicationStatusForm applicationId={app.id} currentStatus={app.status} currentNotes={app.notes || ""} />
                </div>
            </div>
        </div>
    );
}