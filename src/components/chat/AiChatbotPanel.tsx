"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AiChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiChatbotPanel({ isOpen, onClose }: AiChatbotPanelProps) {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello! I am Buzz, your digital concierge. How can I help you elevate your brand today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");

    // Simulate AI response (Placeholder for Gemini/OpenAI integration)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Thank you for reaching out! A strategist will follow up regarding your request shortly. (AI integration pending)" },
      ]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-card border border-border/50 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          <div className="bg-primary p-4 text-primary-foreground font-heading font-semibold flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center font-bold">B</div>
              <div>
                <p className="text-sm font-bold">Buzz AI</p>
                <p className="text-xs font-normal opacity-80">Always active</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors text-primary-foreground"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border flex gap-2 items-center bg-background">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about services..."
              className="flex-1 rounded-full border-border bg-card"
            />
            <Button size="icon" className="rounded-full shrink-0" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
