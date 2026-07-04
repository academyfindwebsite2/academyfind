import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import DropResumeForm from "@/components/User/DropResume";

export const metadata: Metadata = {
    title: "Drop Your Resume | AcademyFind Careers",
    description: "Submit your resume to the AcademyFind Talent Pool. We are always on the lookout for passionate individuals to join our mission.",
    alternates: {
        canonical: "https://www.academyfind.com/careers/drop-resume"
    },
    openGraph: {
        title: "Join the AcademyFind Talent Pool",
        description: "Submit your resume for future opportunities at AcademyFind.",
        url: "https://www.academyfind.com/careers/drop-resume",
        type: "website"
    }
};

export default function DropResumePage() {
    return (
        <div className="min-h-screen py-12 px-4 font-sans bg-linear-to-b from-amber-50 via-background to-transparent dark:from-amber-950/10">
            <div className="max-w-3xl mx-auto">
                <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Careers
                </Link>

                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-4">
                        <Sparkles className="h-3.5 w-3.5" /> Talent Pool
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Drop Your <span className="text-amber-400">Resume</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg">
                        Didn't find a role that fits your profile right now? Upload your resume here, and our hiring team will reach out when the perfect opportunity opens up.
                    </p>
                </div>

                {/* Form Component */}
                <DropResumeForm />
            </div>
        </div>
    );
}