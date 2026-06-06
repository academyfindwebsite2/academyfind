"use client";

import { useTransition, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface SmartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string; // Agar ye link ki tarah kaam karega
  children: ReactNode;
  action?: () => Promise<void>; // Agar ye koi form submit ya API call karega
}

export default function SmartButton({ href, children, action, className, ...props }: SmartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Agar custom onClick pass kiya hai, toh wo chale
    if (props.onClick) {
      props.onClick(e);
    }

    startTransition(async () => {
      // 1. Agar href diya hai, toh route change karo
      if (href) {
        router.push(href);
      } 
      // 2. Agar koi async action diya hai (API call etc), toh usko await karo
      else if (action) {
        await action();
      }
    });
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={isPending || props.disabled}
      className={`
        relative inline-flex items-center justify-center gap-2 transition-all active:scale-95
        ${isPending ? "opacity-70 cursor-not-allowed" : ""}
        ${className} // User ki custom classes yahan append hongi
      `}
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}