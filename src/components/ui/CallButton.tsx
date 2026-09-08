"use client";

import React from "react";
import { Phone } from "lucide-react";

export default function CallButton() {
  const phoneNumber = "919205386625";
  const callUrl = `tel:+${phoneNumber}`;

  return (
    <a
      href={callUrl}
      className="fixed bottom-[10.5rem] right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      aria-label="Call BuzzSpire"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
}
