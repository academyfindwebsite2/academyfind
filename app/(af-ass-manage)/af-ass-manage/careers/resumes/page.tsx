import { prisma } from "@/lib/prisma";
import { FileText, Download, Globe, Mail, Phone } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

export default async function GeneralResumesPage() {
    const resumes = await prisma.generalResume.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="p-6 md:p-10 w-full space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                    <FileText className="w-8 h-8 text-purple-600" /> Talent Pool Resumes
                </h1>
                <p className="text-slate-500 mt-1">Candidates who submitted their resumes for future opportunities.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resumes.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-700">No resumes yet</h3>
                        <p className="text-slate-500 text-sm">When candidates drop their resume, they will appear here.</p>
                    </div>
                ) : (
                    resumes.map((resume: any) => (
                        <div key={resume.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{resume.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Submitted: {new Date(resume.createdAt).toLocaleDateString()}</p>
                                </div>
                                <a href={resume.resumeUrl} target="_blank" rel="noopener noreferrer" className="bg-purple-50 text-purple-600 p-2 rounded-xl hover:bg-purple-100 transition" title="View Resume">
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="space-y-2 mt-4 text-sm text-slate-600">
                                <a href={`mailto:${resume.email}`} className="flex items-center gap-2 hover:text-purple-600">
                                    <Mail className="w-4 h-4 text-slate-400" /> {resume.email}
                                </a>
                                <a href={`tel:${resume.phone}`} className="flex items-center gap-2 hover:text-purple-600">
                                    <Phone className="w-4 h-4 text-slate-400" /> {resume.phone}
                                </a>
                                {resume.linkedinUrl && (
                                    <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600">
                                        <FaLinkedin className="w-4 h-4 text-blue-500" /> LinkedIn Profile
                                    </a>
                                )}
                                {resume.portfolioUrl && (
                                    <a href={resume.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-600">
                                        <Globe className="w-4 h-4 text-slate-400" /> Portfolio Website
                                    </a>
                                )}
                            </div>

                            {resume.message && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 italic border border-slate-100">
                                    "{resume.message}"
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}