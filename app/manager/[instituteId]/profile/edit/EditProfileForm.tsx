"use client"

import { Button } from "@/components/ui/button";
import { updateInstituteProfile } from "@/lib/User/manager/updateProfile";
import { Save, Lock } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";
import VideoSettings from "./EditVideoLinks";
import Link from "next/link";
import { PLAN_LIMITS, PlanType } from "@/lib/plan_limits";
import EditTeachers from "./EditTeacherProfile";
import EditResultImages from "./EditResultImages";

export default function EditProfileForm({institute} : {institute: any}){
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData){
        setIsLoading(true);
        const result = await updateInstituteProfile(institute.id, formData);

        if(result.success){
            toast.success(result.message || "Successfully updated profile")
        } else {
            toast.error("Can't update Profile, try again")
        }
        setIsLoading(false)
    }

    const limits = PLAN_LIMITS[institute.subscriptionPlan as PlanType];

    return (
        <div className="space-y-8">
            {/* 🚀 MAIN FORM */}
            <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Basic Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Institute Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Institute Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            defaultValue={institute.name || ""} 
                            required
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Public Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            defaultValue={institute.email || ""} 
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                        <input 
                            type="text" 
                            name="phone" 
                            defaultValue={institute.phone || ""} 
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Website URL</label>
                        <input 
                            type="url" 
                            name="website" 
                            defaultValue={institute.website || ""} 
                            placeholder="https://..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Address</label>
                    <input 
                        type="text" 
                        name="address" 
                        defaultValue={institute.address || ""} 
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">About the Institute</label>
                    <textarea 
                        name="description" 
                        rows={5}
                        defaultValue={institute.description || ""} 
                        placeholder="Tell students about your courses, batches, and achievements..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 px-6"
                    >
                        {isLoading ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                    </Button>
                </div>
            </form>

            {/* 🚀 EXTERNAL COMPONENTS (Outside the form so their buttons don't trigger form submit) */}
            
            {limits.maxVideos > 0 ? (
                <VideoSettings 
                    instituteId={institute.id} 
                    currentVideos={institute.youtubeVideos || []} 
                    maxLimit={limits.maxVideos} 
                />
            ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                        <Lock className="w-6 h-6 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">YouTube Videos Locked</h3>
                    <p className="text-sm text-slate-500 max-w-md mt-1 mb-4">
                        You are currently on the Free Listing plan. Upgrade your plan to showcase your academy's YouTube videos directly on your profile.
                    </p>
                    <Link href={`/manager/${institute.id}/subscription`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition">
                        View Premium Plans
                    </Link>
                </div>
            )}
            
            <EditResultImages 
                instituteId={institute.id} 
                currentImages={institute.gallery || []} 
                maxLimit={limits.maxResults} 
            />


            <EditTeachers 
                instituteId={institute.id} 
                currentTeachers={institute.teachers || []} 
                maxLimit={limits.maxTeachers} 
            />

        </div>
    );
}