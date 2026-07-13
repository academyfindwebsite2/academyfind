"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteCallback, updateCallbackStatus } from "@/lib/User/admin/adminInstituteCallback";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function CallbackControls({ id, currentStatus }: { id: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  const executeDelete = async () => {
    setLoading(true);
    setIsConfirmOpen(false);
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
    <>
      <div className="flex items-center gap-3">
        {/* Status Dropdown */}
        <select 
          value={currentStatus || "NEW"} 
          onChange={handleStatusChange}
          disabled={loading}
          className="bg-stone-50 border border-stone-200 text-stone-700 text-sm font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-stone-500 cursor-pointer"
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Delete Button */}
        <button 
          onClick={() => setIsConfirmOpen(true)}
          disabled={loading}
          className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-lg border border-red-100 transition"
          title="Delete Enquiry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        title="Delete Enquiry permanently?"
        description="This action cannot be undone. The enquiry will be removed."
        destructive={true}
        confirmText="Delete"
      />
    </>
  );
}