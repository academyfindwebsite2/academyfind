"use client"

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, Tag, CornerDownRight } from "lucide-react";
import CategoryStatusToggle from "./AdminCategoryStatusToggle"; 

export default function CategoryTreeView({ category, level = 0 }: { category: any, level?: number }) {
    // Level 0 (Main Categories) ko by default open rakhenge
    const [isOpen, setIsOpen] = useState(level === 0); 
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="w-full flex flex-col">
            <div 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${!category.isActive ? 'bg-slate-50/50 opacity-60' : ''}`} 
                style={{ paddingLeft: level === 0 ? '1rem' : `${level * 2 + 1}rem` }}
            >
                <div className="flex items-center gap-3">
                    {/* Expand/Collapse Button */}
                    {hasChildren ? (
                        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-slate-200 rounded-md transition-colors">
                            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                        </button>
                    ) : (
                        <div className="w-6 flex justify-center">
                            {level > 0 && <CornerDownRight className="w-3.5 h-3.5 text-slate-300" />}
                        </div>
                    )}

                    {/* Icons Based on Hierarchy */}
                    {hasChildren ? (
                        isOpen ? <FolderOpen className="w-4 h-4 text-indigo-500 shrink-0" /> : <Folder className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                        <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                    )}

                    <span className="font-semibold text-slate-800 text-sm">{category.name}</span>
                    <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">/{category.slug}</span>
                </div>

                <div className="flex items-center gap-4 mt-2 sm:mt-0 pl-9 sm:pl-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${category._count?.institutes > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {category._count?.institutes || 0} Listed
                    </span>
                    <CategoryStatusToggle categoryId={category.id} isActive={category.isActive} />
                </div>
            </div>

            {/* Recursion: Render Children if Open */}
            {isOpen && hasChildren && (
                <div className="flex flex-col w-full">
                    {category.children.map((child: any) => (
                        <CategoryTreeView key={child.id} category={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}