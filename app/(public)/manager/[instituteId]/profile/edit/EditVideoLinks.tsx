"use client"

import { useState } from "react";
import { addYouTubeVideo, removeYouTubeVideo } from "@/lib/User/manager/update-youtube-links";
import { Lock, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaYoutube } from "react-icons/fa";

export default function VideoSettings({ 
    instituteId, 
    currentVideos, 
    maxLimit 
}: { 
    instituteId: string; 
    currentVideos: string[]; 
    maxLimit: number;
}) {
    const [videoUrl, setVideoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isLimitReached = currentVideos.length >= maxLimit;

    async function handleAdd() {
        if (!videoUrl) return;
        setIsLoading(true);
        const result = await addYouTubeVideo(instituteId, videoUrl);
        if (result.success) {
            toast.success(result.message || "Sucessfully added links");
            setVideoUrl("");
        } else {
            toast.error(result.error || "Can't delete links");
        }
        setIsLoading(false);
    }

    async function handleDelete(url: string) {
        if (!confirm("Remove this video?")) return;
        const result = await removeYouTubeVideo(instituteId, url);
        if (result.success) toast.success(result.message || "sucessfully deleted links");
        else toast.error(result.error || "Can't delete link");
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaYoutube className="w-5 h-5 text-red-500" /> YouTube Videos
                    </h3>
                    <p className="text-sm text-slate-500">
                        Added: {currentVideos.length} / {maxLimit === 0 ? '0 (Locked)' : maxLimit}
                    </p>
                </div>
                
                {/* 🔒 UPGRADE BUTTON DIKHAO AGAR LIMIT HIT HO GAYI HAI */}
                {isLimitReached && maxLimit > 0 && (
                    <Link href={`/manager/${instituteId}/upgrade`} className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition">
                        <Lock className="w-3.5 h-3.5" /> Upgrade for more
                    </Link>
                )}
            </div>

            {/* ADD VIDEO INPUT */}
            <div className="flex gap-3 mb-6">
                <input 
                    type="url" 
                    placeholder="Paste YouTube Video URL..." 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    disabled={isLimitReached || maxLimit === 0 || isLoading}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-50"
                />
                <button 
                    onClick={handleAdd}
                    disabled={isLimitReached || maxLimit === 0 || isLoading || !videoUrl}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {maxLimit === 0 && (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center mb-6">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Video features are locked in the Free Plan.</p>
                    <Link href={`/manager/${instituteId}/upgrade`} className="text-xs text-blue-600 font-bold hover:underline mt-1 inline-block">
                        View Premium Plans
                    </Link>
                </div>
            )}

            <div className="space-y-3">
                {currentVideos.map((url: any, idx: any) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50 rounded-xl">
                        <a href={url} target="_blank" className="text-sm text-blue-600 hover:underline truncate pr-4">
                            {url}
                        </a>
                        <button onClick={() => handleDelete(url)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}