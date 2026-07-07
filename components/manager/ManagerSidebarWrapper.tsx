"use client";

import { useState, useEffect } from "react";
import { Menu, X, PanelLeftClose, PanelLeftOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ManagerSidebarWrapper({ children, title = "Manager Menu" }: { children: React.ReactNode, title?: string }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className={`relative transition-all duration-300 ease-in-out shrink-0 ${isOpen ? "w-full md:w-64" : "w-full md:w-0"}`}>
      
      {/* Mobile Header/Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <span className="font-bold text-sm text-slate-700">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl"
        >
          {isOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
        </Button>
      </div>

      {/* Desktop Floating Toggle Button */}
      <div className="hidden md:block absolute -right-5 top-1 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-8 h-8 bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all hover:scale-105"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      <aside className={`space-y-6 ${isOpen ? "block" : "hidden md:hidden"}`}>
        {children}
      </aside>
    </div>
  );
}
