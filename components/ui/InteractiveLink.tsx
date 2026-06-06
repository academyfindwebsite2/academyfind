"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface InteractiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function InteractiveLink({ href, children, className }: InteractiveLinkProps) {
  // Click track karne ke liye state
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Link
      href={href}
      // Jaise hi user click karega, spinner ghumna shuru ho jayega
      onClick={() => setIsClicked(true)} 
      className={`
        ${isClicked ? "bg-amber-400 opacity-80 cursor-wait" : ""}
        ${className}
      `}
    >
      {/* Agar click ho gaya hai, toh spinner dikhao */}
      {isClicked && <Loader2 className="h-4 w-4 text-white animate-spin" />}
      
      {/* Text (e.g., "Explore JEE") */}
      {children}
    </Link>
  );
}