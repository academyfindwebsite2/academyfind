"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteCallback, updateCallbackStatus } from "@/lib/User/admin/adminInstituteCallback";

export default function CallbackControls({ id, currentStatus }: { id: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const statuses = ["NEW", "MESSAGED", "CALLED", "DNP", "JUNK"];

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    const newStatus = e.target.value;
    const res = await updateCallbackStatus(id, newStatus);
    if (res.success) {
      toast.success("Status updated!");
    } else {
      toast.error(res.error || "Failed");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this enquiry permanently?")) return;
    
    setLoading(true);
    const res = await deleteCallback(id);
    if (res.success) {
      toast.success("Enquiry deleted!");
      router.push("/af-ass-manage/instituteCallbacks");
    } else {
      toast.error(res.error || "Failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Dropdown */}
      <select 
        value={currentStatus || "NEW"} 
        onChange={handleStatusChange}
        disabled={loading}
        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
      >
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Delete Button */}
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-lg border border-red-100 transition"
        title="Delete Enquiry"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}