"use client";

import { useState, useEffect } from "react";
import { ReactLenis } from "lenis/react";

export default function LenisInstance() {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const checkDesktop = () => {
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const isMobileWidth = window.innerWidth < 1024;
      setIsDesktop(!isCoarsePointer && !isMobileWidth);
    };

    checkDesktop();

    const mediaQueryCoarse = window.matchMedia("(pointer: coarse)");
    const mediaQueryWidth = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      checkDesktop();
    };

    mediaQueryCoarse.addEventListener("change", handleChange);
    mediaQueryWidth.addEventListener("change", handleChange);
    window.addEventListener("resize", handleChange);

    return () => {
      mediaQueryCoarse.removeEventListener("change", handleChange);
      mediaQueryWidth.removeEventListener("change", handleChange);
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  if (!mounted || !isDesktop) return null;
  return <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }} />;
}
