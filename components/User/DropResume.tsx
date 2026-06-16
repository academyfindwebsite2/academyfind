"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { submitGeneralResume } from "@/lib/User/user/general-resume";

export default function DropResumeForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        
        try {
            const result = await submitGeneralResume(formData);
            if (result.success) {
                setStatus({ success: true });
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus({ error: result.error });
            }
        } catch (error) {
            setStatus({ error: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status?.success) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center animate-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Resume Submitted!</h3>
                <p className="text-slate-600 mt-2">Thank you for your interest in AcademyFind. We have added your profile to our Talent Pool and will contact you if a matching role opens up.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-amber-200 shadow-sm p-6 md:p-8 space-y-6">
            {status?.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {status.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name *</label>
                    <input required name="name" type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address *</label>
                    <input required name="email" type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number *</label>
                    <input required name="phone" type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none" placeholder="+91 9876543210" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">LinkedIn Profile</label>
                    <input name="linkedinUrl" type="url" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none" placeholder="https://linkedin.com/in/..." />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Portfolio / Website (Optional)</label>
                <input name="portfolioUrl" type="url" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none" placeholder="https://yourwebsite.com" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cover Note / Message (Optional)</label>
                <textarea name="message" rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none resize-none" placeholder="Tell us a bit about what you're looking for..."></textarea>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Resume / CV (PDF max 5MB) *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition-colors text-center relative cursor-pointer">
                    <input required name="resumeFile" type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <span className="text-sm text-slate-600 font-medium">Click to upload or drag & drop</span>
                </div>
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 h-auto rounded-xl text-base transition-all shadow-md">
                {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Profile...</>
                ) : "Submit to Talent Pool"}
            </Button>
        </form>
    );
}