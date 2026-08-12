"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DynamicChatbotPanel = dynamic(() => import("./AiChatbotPanel"), {
  ssr: false,
});

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleToggle = () => {
    if (!hasBeenOpened) {
      setHasBeenOpened(true);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggle}
          size="icon"
          className="w-14 h-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:scale-105 transition-transform"
          aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {hasBeenOpened && (
        <DynamicChatbotPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
