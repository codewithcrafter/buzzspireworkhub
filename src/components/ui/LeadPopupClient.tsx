"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LeadPopup = dynamic(() => import("@/components/ui/LeadPopup"), {
  ssr: false,
});

export default function LeadPopupClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <LeadPopup />;
}

