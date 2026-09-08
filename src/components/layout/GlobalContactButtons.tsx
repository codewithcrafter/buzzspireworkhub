"use client";

import { usePathname } from "next/navigation";
import CallButton from "@/components/ui/CallButton";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function GlobalContactButtons() {
  const pathname = usePathname();

  // Hide the floating contact buttons on admin and login routes
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/employee")
  ) {
    return null;
  }

  return (
    <>
      <CallButton />
      <WhatsAppButton />
    </>
  );
}
