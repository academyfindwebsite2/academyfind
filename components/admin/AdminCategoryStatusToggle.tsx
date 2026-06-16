"use client"

import { useState } from "react"
import { toggleCategoryStatus } from "@/lib/User/admin/adminCategories"
import toast from "react-hot-toast"

export default function CategoryStatusToggle({ categoryId, isActive }: { categoryId: string, isActive: boolean }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleToggle() {
        setIsLoading(true);
        const result = await toggleCategoryStatus(categoryId, isActive);
        
        if (result.success) toast.success(result.message || "Category status changed scuccessfully");
        else toast.error(result.error || "Can't change category status");
        
        setIsLoading(false);
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive 
                    ? "bg-amber-50 text-amber-600 hover:bg-amber-100" 
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
        >
            {isLoading ? "..." : (isActive ? "Hide" : "Unhide")}
        </button>
    )
}