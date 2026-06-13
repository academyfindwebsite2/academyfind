"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { updateLifeCoachStatus } from "@/lib/User/admin/adminLifeCoachStatus";

interface StatusUpdaterProps {
  requestId: string;
  currentStatus: "PENDING" | "CONTACTED" | "RESOLVED";
}

export default function StatusUpdater({ requestId, currentStatus }: StatusUpdaterProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "PENDING" | "CONTACTED" | "RESOLVED";
    setLoading(true);
    setStatus(newStatus);

    const res = await updateLifeCoachStatus(requestId, newStatus);
    
    if (res.success) {
      toast.success(res.message || "Status updated successfully");
    } else {
      toast.error(res.error || "Failed to update status");
      setStatus(currentStatus); // Revert on failure
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-bold text-slate-400 uppercase">Status:</label>
      <div className="relative">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={loading}
          className={`appearance-none pl-4 pr-8 py-2 rounded-xl text-sm font-bold uppercase tracking-wider outline-none cursor-pointer border transition-all ${
            status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
            status === "CONTACTED" ? "bg-blue-50 text-blue-700 border-blue-200" :
            "bg-emerald-50 text-emerald-700 border-emerald-200"
          } disabled:opacity-50`}
        >
          <option value="PENDING">Pending</option>
          <option value="CONTACTED">Contacted</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        
        {loading && (
          <Loader2 className="w-3.5 h-3.5 animate-spin absolute right-3 top-1/2 -translate-y-1/2 opacity-70" />
        )}
      </div>
    </div>
  );
}