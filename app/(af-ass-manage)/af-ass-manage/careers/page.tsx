import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Users, Plus, Eye, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminCareersDashboard() {
    const jobs = await prisma.jobPosting.findMany({
        include: {
            _count: { select: { applications: true } },
            applications: {
                where: { status: "NEW" },
                select: { id: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                        <Briefcase className="w-8 h-8 text-purple-600" /> Career Openings
                    </h1>
                    <p className="text-slate-500 mt-1">Manage job postings and track incoming applications.</p>
                </div>
                <Link prefetch={false} href="/af-ass-manage/careers/resumes">
                    <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 font-bold gap-2">
                        <FileText className="w-4 h-4" /> Talent Pool
                    </Button>
                </Link>
                <Link prefetch={false} href="/af-ass-manage/careers/new">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2">
                        <Plus className="w-4 h-4" /> Post New Job
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="p-4">Job Title & Details</th>
                            <th className="p-4">Visibility</th>
                            <th className="p-4 text-center">Applications</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {jobs.map((job: any) => (
                            <tr key={job.id} className="hover:bg-slate-50/50 transition">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800 text-base">{job.title}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        <span className="font-medium text-slate-700">{job.department}</span> • {job.location} • {job.type}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {job.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><CheckCircle2 className="w-3 h-3" /> ACTIVE</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100"><XCircle className="w-3 h-3" /> CLOSED</span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <Link prefetch={false} href={`/af-ass-manage/careers/${job.id}`} className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold transition">
                                        <Users className="w-4 h-4" /> {job._count.applications} Total
                                        {job.applications.length > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 animate-pulse">
                                                {job.applications.length} New
                                            </span>
                                        )}
                                    </Link>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link prefetch={false} href={`/careers/${job.slug}`} target="_blank" className="text-slate-400 hover:text-slate-900 transition" title="View Public Page">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link prefetch={false} href={`/af-ass-manage/careers/${job.id}/edit`} className="text-purple-600 hover:text-purple-800 font-bold text-xs uppercase tracking-wider">
                                            Edit Post
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">No job postings created yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}