"use client";

import { ReactNode, useState, useEffect } from "react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProps {
  children: ReactNode;
}

import dynamic from "next/dynamic";

const LenisInstance = dynamic(() => import("./LenisInstance"), { ssr: false });

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <>
      <LenisInstance />
      {children}
    </>
  );
}
