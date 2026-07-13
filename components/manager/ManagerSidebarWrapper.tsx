"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ManagerSidebarWrapper({ children, title = "Manager Dashboard" }: { children: React.ReactNode, title?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-white/80 backdrop-blur-md p-4 sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <span className="font-extrabold text-lg bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">{title}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="rounded-full hover:bg-slate-100"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-[280px] max-w-[80vw] h-full bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg text-slate-800">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} className="rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto pb-8 space-y-6 scrollbar-hide" onClick={(e) => {
              if ((e.target as HTMLElement).closest('a')) setIsMobileOpen(false);
            }}>
              {children}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Container */}
      <div className={`hidden lg:block shrink-0 transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? "w-64" : "w-0 opacity-0 mx-0 overflow-hidden"}`}>
        <div className="sticky top-8 relative h-[calc(100vh-4rem)]">
          <aside className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-stone-200/60 shadow-sm rounded-[2rem] p-6 flex flex-col space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </aside>
          
          {/* Collapse button */}
          <div className={`absolute z-30 transition-all duration-400 ${isOpen ? "right-6" : "opacity-0 pointer-events-none"} top-10`}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full w-7 h-7 bg-white border border-stone-200 shadow-sm text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-all hover:scale-110"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
          </div>
        </div>
      </div>

      {/* Expand button (Visible when closed on Desktop) */}
      {!isOpen && (
        <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-30">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="rounded-full w-10 h-10 bg-white/90 backdrop-blur-md border border-stone-200 shadow-md text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all hover:scale-110"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </>
  );
}
