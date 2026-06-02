"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!glowRef.current) return;

      glowRef.current.animate(
        {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
        },
        {
          duration: 500,
          fill: "forwards",
        }
      );
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-[9999]
        h-[350px]
        w-[350px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        blur-3xl
      "
      style={{
        background:
          "radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0) 70%)",
      }}
    />
  );
}