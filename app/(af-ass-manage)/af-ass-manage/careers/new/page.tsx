"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Briefcase } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createJobPosting } from "@/lib/User/admin/adminhandleJob";

export default function PostNewJobPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("isActive", String(isActive));

        try {
            const res = await createJobPosting(formData);
            if (res.success) {
                toast.success("Job posted successfully!");
                router.push("/af-ass-manage/careers");
            } else {
                toast.error(res.error || "Failed to post job.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
            <Link href="/af-ass-manage/careers" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-purple-600 transition">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post a New Job</h1>
                    <p className="text-sm text-slate-500">Fill in the details to publish a new career opportunity.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Job Title <span className="text-red-500">*</span></Label>
                            <Input name="title" required placeholder="e.g. Senior React Developer" className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Department <span className="text-red-500">*</span></Label>
                            <select name="department" required className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                                <option value="">Select Department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Sales">Sales</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operations">Operations</option>
                                <option value="Design">Design</option>
                                <option value="HR">HR</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Location <span className="text-red-500">*</span></Label>
                            <Input name="location" required placeholder="e.g. Remote, Noida" className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Job Type <span className="text-red-500">*</span></Label>
                            <select name="type" required className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">Experience Req.</Label>
                            <Input name="experience" placeholder="e.g. 2-4 Years" className="bg-slate-50" />
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-6">
                        <Label className="text-slate-700 font-bold">Salary Information</Label>
                        <Input name="Salary" placeholder="e.g. ₹8,00,000 - ₹12,00,000 LPA (Optional)" className="bg-slate-50 md:w-1/2" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">Job Description <span className="text-red-500">*</span></Label>
                        <Textarea name="description" required rows={4} placeholder="Short overview of the role..." className="bg-slate-50 resize-none" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">Key Responsibilities <span className="text-red-500">*</span></Label>
                        <Textarea name="responsibilities" required rows={5} placeholder="What will the candidate do day-to-day?" className="bg-slate-50 resize-none" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">Requirements / Skills <span className="text-red-500">*</span></Label>
                        <Textarea name="requirements" required rows={5} placeholder="Required tech stack, degrees, or traits..." className="bg-slate-50 resize-none" />
                    </div>

                    <div className="space-y-2 border-b pb-6">
                        <Label className="text-slate-700 font-bold">Benefits & Perks</Label>
                        <Textarea name="benefits" rows={4} placeholder="Health insurance, flexible hours, etc..." className="bg-slate-50 resize-none" />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div>
                            <Label className="text-base font-bold text-slate-800">Publish Immediately</Label>
                            <p className="text-xs text-slate-500">If active, candidates can start applying right away.</p>
                        </div>
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 rounded-xl gap-2 font-bold px-8">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? "Posting Job..." : "Post Job Vacancy"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}