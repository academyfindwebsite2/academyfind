"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function InstitutePagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const changePage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/admin/institutes?${params.toString()}`);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-t-0 border-slate-200 rounded-b-2xl">
            <span className="text-sm text-slate-500">
                Page <span className="font-bold text-slate-800">{currentPage}</span> of {totalPages}
            </span>
            <div className="flex gap-2">
                <button 
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 transition"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 transition"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}