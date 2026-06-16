"use client"

import { useState } from "react"
import { toggleInstituteStatus } from "@/lib/User/admin/ToggleInstitute"
import toast from "react-hot-toast"

export default function ToggleStatusButton({ instituteId, isActive }: { instituteId: string, isActive: boolean }) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleToggle() {
        setIsLoading(true);
        const result = await toggleInstituteStatus(instituteId, isActive);
        
        if (result.success) {
            toast.success(result.message || "Scussesfully Changed status Institute");
        } else {
            toast.error(result.error || "Cannot change status");
        }
        setIsLoading(false);
    }

    return (
        <button 
            onClick={handleToggle}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
            ${isActive 
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
            }`}
        >
            {isLoading ? "Wait..." : (isActive ? "Hide Profile" : "Unhide")}
        </button>
    )
}