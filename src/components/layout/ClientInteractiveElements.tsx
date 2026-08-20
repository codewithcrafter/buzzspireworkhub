"use client";

import dynamic from "next/dynamic";

const LeadPopupClient = dynamic(() => import("@/components/ui/LeadPopupClient"), { ssr: false });
const LeadChatbot = dynamic(() => import("@/components/chat/LeadChatbot"), { ssr: false });

export default function ClientInteractiveElements() {
  return (
    <>
      <LeadPopupClient />
      <LeadChatbot />
    </>
  );
}
