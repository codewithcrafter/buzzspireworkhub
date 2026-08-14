"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LeadPopup = dynamic(() => import("@/components/ui/LeadPopup"), {
  ssr: false,
});

export default function LeadPopupClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(
          () => {
            setTimeout(() => setMounted(true), 2000);
          },
          { timeout: 3500 }
        );
      } else {
        const timer = setTimeout(() => setMounted(true), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!mounted) return null;

  return <LeadPopup />;
}
