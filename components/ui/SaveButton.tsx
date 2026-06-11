"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleShortlist } from "@/lib/User/user/user-activity";

interface SaveButtonProps {
  userId?: string; // Optional rakha hai, in case guest user ho
  instituteId: string;
  isInitiallySaved: boolean; // Server se check karke bhejenge ki pehle se saved hai ya nahi
}

export default function SaveButton({ userId, instituteId, isInitiallySaved }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Agar card Link tag ke andar hai toh usko rokne ke liye
    
    // Agar user login nahi hai, toh login page par bhej do
    if (!userId) {
      router.push("/login");
      return;
    }

    setLoading(true);
    
    // Optimistic UI update (turant color change kar do)
    setIsSaved(!isSaved);

    // Server action call karo
    const res = await toggleShortlist(userId, instituteId);
    
    // Agar server pe error aayi, toh wapas purana state kar do
    if (!res.success) {
      setIsSaved(isSaved);
      console.error(res.error);
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleSave}
      disabled={loading}
      className={`p-2 rounded-full transition-all flex items-center justify-center
        ${isSaved 
          ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
        }`}
    >
      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-600' : ''}`} />
    </button>
  );
}