"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let y = 0;
    let x = 0;
    
    switch (direction) {
      case "up": y = 50; break;
      case "down": y = -50; break;
      case "left": x = 50; break;
      case "right": x = -50; break;
    }

    gsap.fromTo(
      containerRef.current,
      { y, x, opacity: 0, rotateX: direction === "up" ? 5 : 0 },
      {
        y: 0,
        x: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Trigger when top of element hits 85% down the viewport
          toggleActions: "play none none reverse", // Play on enter, reverse on leave
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`will-change-transform opacity-0 ${className}`}>
      {children}
    </div>
  );
}
