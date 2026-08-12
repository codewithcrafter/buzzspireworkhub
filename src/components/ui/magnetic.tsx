"use client";

import { motion } from "framer-motion";
import { useRef, useState, ReactElement } from "react";

interface MagneticProps {
  children: ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const { clientX, clientY } = e;
    const target = ref.current;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!target) return;
      const { left, top, width, height } = target.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      setPosition({ x: x * strength, y: y * strength });
      rafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
