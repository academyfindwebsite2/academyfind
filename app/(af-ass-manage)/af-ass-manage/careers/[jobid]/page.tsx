import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, FileText, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { formatIST } from "@/lib/utils";

export default async function JobApplicationsPage({ params }: { params: Promise<{ jobid: string }> }) {
    const {jobid} = await params;
    const job = await prisma.jobPosting.findUnique({
        where: { id: jobid },
        include: {
            applications: { orderBy: { createdAt: "desc" } }
        }
    });

    if (!job) return notFound();

    // Helper for status colors
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "NEW": return "bg-stone-50 text-stone-700 border border-stone-200/50 shadow-sm";
            case "REVIEWING": return "bg-stone-100 text-stone-700";
            case "SHORTLISTED": return "bg-emerald-100 text-emerald-700";
            case "REJECTED": return "bg-rose-100 text-rose-700";
            case "HIRED": return "bg-purple-100 text-purple-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="p-6 md:p-10 w-full space-y-6">
            <Link href="/af-ass-manage/careers" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-purple-600 transition">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Jobs
            </Link>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                    <p className="text-sm text-slate-500 mt-1">{job.department} • {job.location}</p>
                </div>
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5" /> {job.applications.length} Candidates
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="p-4">Candidate</th>
                            <th className="p-4">Applied On</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100/50">
                        {job.applications.map((app: any) => (
                            <tr key={app.id} className="hover:bg-slate-50/50 transition">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{app.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{app.email} • {app.phone}</div>
                                </td>
                                <td className="p-4 text-slate-600 font-medium text-xs">
                                    {formatIST(app.createdAt, "PPp")}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/af-ass-manage/careers/${job.id}/${app.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition">
                                        Review Profile
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {job.applications.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">No applications received yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}