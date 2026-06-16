"use client";


import { toggleUserListingPermission } from "@/lib/User/admin/adminUser";
import toast from "react-hot-toast";

export default function UserPermissionToggle({ user }: { user: any }) {
    // Admin ka hamesha ON rahega, usko change nahi kar sakte
    const isAdmin = user.role === "ADMIN";

    const handleToggle = async () => {
        if (isAdmin) return; // Admin can't be toggled off
        
        const newStatus = !user.canAddInstitute;
        const res = await toggleUserListingPermission(user.id, newStatus);
        
        if (res.success) {
            toast.success(newStatus ? "Permission Granted!" : "Permission Revoked!");
        } else {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isAdmin ? true : user.canAddInstitute}
                    disabled={isAdmin}
                    onChange={handleToggle}
                />
                <div className={`w-11 h-6 rounded-full peer 
                    ${isAdmin || user.canAddInstitute ? 'bg-emerald-500' : 'bg-slate-300'} 
                    peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
                </div>
            </label>
            {isAdmin && <span className="text-xs text-slate-400 font-bold">Admin (Always ON)</span>}
        </div>
    );
}