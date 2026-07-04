"use client"

import { useState } from "react";
import { addResultImage, removeResultImage } from "@/lib/User/manager/update-result-image";
import { Lock, Image as ImageIcon, Trash2, UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditResultImages({ 
    instituteId, 
    currentImages, 
    maxLimit 
}: { 
    instituteId: string; 
    currentImages: string[]; 
    maxLimit: number;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const isLimitReached = currentImages.length >= maxLimit;

    // ☁️ Cloudinary Upload & DB Save
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("imageFile", file); // File attached directly

        const result = await addResultImage(instituteId, formData);
        
        if (result.success) toast.success(result.message || "Successfully uploaded Image");
        else toast.error(result.error || "Can't upload image");
        
        setIsUploading(false);
        e.target.value = ""; // Reset input
    };

    async function handleDelete(url: string) {
        if (!confirm("Delete this image?")) return;
        const result = await removeResultImage(instituteId, url);
        if (result.success) toast.success("Image removed.");
        else toast.error("Failed to remove image.");
    }

    // 🔒 LOCKED STATE (For Free Plan)
    if (maxLimit === 0) {
        return (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Result Gallery Locked</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1 mb-4">Upgrade your plan to showcase your top rankers and academy photos.</p>
                <Link href={`/manager/${instituteId}/upgrade`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition">View Plans</Link>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-indigo-500" /> Result Images
                    </h3>
                    <p className="text-sm text-slate-500">
                        Added: {currentImages.length} / {maxLimit}
                    </p>
                </div>
                
                {isLimitReached ? (
                    <Link href={`/manager/${instituteId}/upgrade`} className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Upgrade for more
                    </Link>
                ) : (
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        {isUploading ? "Uploading..." : "Upload Image"}
                        <input type="file" accept="image/*" disabled={isUploading || isLimitReached} onChange={handleImageUpload} className="hidden" />
                    </label>
                )}
            </div>

            {/* IMAGE GRID */}
            {currentImages.length === 0 ? (
                <div className="text-center p-6 border border-dashed rounded-xl text-slate-400 text-sm">No images uploaded yet.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {currentImages.map((url: any, idx:any) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                            <img src={url} alt="Result" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDelete(url)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}