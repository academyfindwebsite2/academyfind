"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ManagerSidebarLink({ href, icon, label, locked, badge, className = "" }: any) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] hover:scale-[1.01] ${className} ${
                isActive 
                    ? "bg-[#ebdbb7]/10 text-stone-900 shadow-[0_0_15px_rgba(235,219,183,0.3)] border border-[#ebdbb7]/40" 
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50 border border-transparent"
            }`}
        >
            <div className="flex items-center gap-3 relative z-10">
                <span className={`[&>svg]:w-4 [&>svg]:h-4 transition-colors duration-500 ${isActive ? "text-amber-700" : "text-stone-400 group-hover:text-stone-600"}`}>
                    {icon}
                </span>
                {label}
            </div>
            
            {/* Background Glow Effect */}
            {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ebdbb7]/5 to-transparent pointer-events-none" />
            )}

            {locked && <span className="text-xs bg-stone-100/80 text-stone-500 px-1.5 rounded relative z-10 border border-stone-200/50">🔒</span>}
            {!locked && badge !== undefined && (
                <span className="rounded-full bg-rose-500/90 shadow-sm px-1.5 py-0.5 text-[10px] font-bold text-white relative z-10 border border-rose-400/50">
                    {badge}
                </span>
            )}
        </Link>
    );
}
