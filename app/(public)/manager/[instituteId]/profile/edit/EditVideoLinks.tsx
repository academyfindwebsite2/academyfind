"use client"

import { useState } from "react";
import { addYouTubeVideo, removeYouTubeVideo } from "@/lib/User/manager/update-youtube-links";
import { Lock, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/confirm-modal";
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
    const [deleteConfirmUrl, setDeleteConfirmUrl] = useState<string | null>(null);

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

    function handleDeleteClick(url: string) {
        setDeleteConfirmUrl(url);
    }

    async function confirmDelete() {
        if (!deleteConfirmUrl) return;
        const url = deleteConfirmUrl;
        setDeleteConfirmUrl(null);
        const result = await removeYouTubeVideo(instituteId, url);
        if (result.success) toast.success(result.message || "sucessfully deleted links");
        else toast.error(result.error || "Can't delete link");
    }

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-700 hover:scale-[1.01]">
            <div className="bg-gradient-to-r from-[#ebdbb7]/40 to-transparent border-b border-[#ebdbb7]/20 p-6 pb-4 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                        <FaYoutube className="w-5 h-5 text-red-500" /> YouTube Videos
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">
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

            <div className="p-6">

            {/* ADD VIDEO INPUT */}
            <div className="flex gap-3 mb-6">
                <input 
                    type="url" 
                    placeholder="Paste YouTube Video URL..." 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    disabled={isLimitReached || maxLimit === 0 || isLoading}
                    className="flex-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-50"
                />
                <button 
                    onClick={handleAdd}
                    disabled={isLimitReached || maxLimit === 0 || isLoading || !videoUrl}
                    className="bg-stone-900 hover:bg-[#ebdbb7] hover:text-stone-900 text-white px-5 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {maxLimit === 0 && (
                <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl p-6 text-center mb-6">
                    <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-6 h-6 text-stone-500" />
                    </div>
                    <p className="text-sm font-medium text-stone-700">Video features are locked in the Free Plan.</p>
                    <Link href={`/manager/${instituteId}/upgrade`} className="text-xs text-stone-800 font-bold hover:underline mt-1 inline-block">
                        View Premium Plans
                    </Link>
                </div>
            )}

            <div className="space-y-3">
                {currentVideos.map((url: any, idx: any) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-stone-100 bg-stone-50 rounded-xl">
                        <a href={url} target="_blank" className="text-sm text-stone-800 hover:underline truncate pr-4">
                            {url}
                        </a>
                        <button onClick={() => handleDeleteClick(url)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteConfirmUrl}
                onClose={() => setDeleteConfirmUrl(null)}
                onConfirm={confirmDelete}
                title="Remove Video?"
                description="Are you sure you want to remove this video?"
                confirmText="Remove"
                destructive
            />
        </div>
    )
}