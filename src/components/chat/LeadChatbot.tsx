"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Bot, CheckCircle2, Phone, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { servicesData } from "@/data/servicesData";

type Step = 
  | "GREETING"
  | "SERVICE" 
  | "NAME" 
  | "COMPANY" 
  | "OWNER" 
  | "PHONE" 
  | "EMAIL" 
  | "CONFIRMATION" 
  | "SUBMITTING"
  | "SUCCESS"
  | "ERROR"
  | "LIVE_WAITING"
  | "LIVE_CHAT";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: React.ReactNode;
}

interface LiveMessage {
  id: string;
  senderType: "VISITOR" | "AGENT" | "SYSTEM";
  message: string;
  createdAt: string;
}

export default function LeadChatbot() {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("GREETING");
  
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Lead Data State
  const [formData, setFormData] = useState({
    service: "",
    name: "",
    company: "",
    isOwner: "",
    phone: "",
    email: ""
  });

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popup coordination state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const autoOpenTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live Chat State
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);


  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveMessages, currentStep]);

  // Session Recovery
  useEffect(() => {
    const savedSession = sessionStorage.getItem("buzzspire_chat_session");
    if (savedSession) {
      setChatSessionId(savedSession);
    }
  }, []);

  // Polling for Live Chat
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (chatSessionId && isOpen) {
      const fetchSession = async () => {
        try {
          const res = await fetch(`/api/chat/session/${chatSessionId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.session) {
              setLiveMessages(data.session.messages);
              
              if (data.session.status === "ACTIVE" && currentStep !== "LIVE_CHAT") {
                setCurrentStep("LIVE_CHAT");
              } else if (data.session.status === "WAITING" && currentStep !== "LIVE_WAITING") {
                setCurrentStep("LIVE_WAITING");
              } else if (data.session.status === "CLOSED") {
                setCurrentStep("SUCCESS");
                setChatSessionId(null);
                sessionStorage.removeItem("buzzspire_chat_session");
                addBotMessage("Thanks for contacting BuzzSpire. This conversation has been closed.");
              }

            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      };
      
      fetchSession();
      interval = setInterval(fetchSession, 3000);
    }
    return () => clearInterval(interval);
  }, [chatSessionId, isOpen, currentStep]);

  const endChatSession = async () => {
    if (chatSessionId) {
      fetch(`/api/chat/session/${chatSessionId}/close`, { method: "POST" }).catch(console.error);
    }
    
    setCurrentStep("SUCCESS");
    setChatSessionId(null);
    sessionStorage.removeItem("buzzspire_chat_session");
    addBotMessage("Chat ended. Thank you for contacting BuzzSpire.");
    setShowEndConfirm(false);
    setShowMenu(false);
  };

  // Auto-open logic coordinated with LeadPopup
  useEffect(() => {
    const handlePopupOpened = () => {
      setIsPopupOpen(true);
      setIsOpen(false); // Ensure chatbot closes if popup opens
      if (autoOpenTimerRef.current) {
        clearTimeout(autoOpenTimerRef.current);
        autoOpenTimerRef.current = null;
      }
    };

    const handlePopupClosed = () => {
      setIsPopupOpen(false);
      
      const hasOpened = sessionStorage.getItem("buzzspire_chatbot_opened");
      if (!hasOpened && !chatSessionId) {
        sessionStorage.setItem("buzzspire_chatbot_opened", "true");
        if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
        autoOpenTimerRef.current = setTimeout(() => {
          setIsOpen((prev) => {
            // Check again to ensure popup didn't reopen somehow
            if (!isPopupOpen) return true;
            return prev;
          });
        }, 1500); // 1.5s delay after popup closes
      }
    };

    window.addEventListener("leadPopupOpened", handlePopupOpened);
    window.addEventListener("leadPopupClosed", handlePopupClosed);

    return () => {
      window.removeEventListener("leadPopupOpened", handlePopupOpened);
      window.removeEventListener("leadPopupClosed", handlePopupClosed);
      if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
    };
  }, [chatSessionId, isPopupOpen]);

  // Initial auto-open if popup will NOT show
  useEffect(() => {
    const hasOpened = sessionStorage.getItem("buzzspire_chatbot_opened");
    if (hasOpened || chatSessionId) return;

    let popupWillShow = true;
    try {
      const stored = localStorage.getItem("buzzspire_lead_popup_status");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.expiresAt && parsed.expiresAt > Date.now()) {
          popupWillShow = false;
        }
      }
    } catch (e) {}

    if (!popupWillShow) {
      sessionStorage.setItem("buzzspire_chatbot_opened", "true");
      if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = setTimeout(() => {
        setIsOpen((prev) => {
          if (!isPopupOpen) return true;
          return prev;
        });
      }, 1500);
    }
    
    return () => {
      if (autoOpenTimerRef.current) {
        clearTimeout(autoOpenTimerRef.current);
      }
    };
  }, [chatSessionId]); // isPopupOpen omitted intentionally here to only run on mount/session changes

  // Focus input when step changes to a text input step
  useEffect(() => {
    if (isOpen && (["NAME", "COMPANY", "PHONE", "EMAIL", "LIVE_CHAT"].includes(currentStep))) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [currentStep, isOpen]);

  // Initialize Chat
  useEffect(() => {
    if (isOpen && messages.length === 0 && !chatSessionId) {
      addBotMessage("Hi! How can I help you?");
      setTimeout(() => {
        addBotMessage("Please select a service:");
        setCurrentStep("SERVICE");
      }, 600);
    }
  }, [isOpen, messages.length, chatSessionId]);

  const addBotMessage = (text: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), sender: "bot", text }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), sender: "user", text }]);
  };


  const handleServiceSelect = (serviceTitle: string) => {
    addUserMessage(serviceTitle);
    setFormData(prev => ({ ...prev, service: serviceTitle }));
    setTimeout(() => {
      addBotMessage("Great! May I know your name?");
      setCurrentStep("NAME");
    }, 400);
  };

  const handleOwnerSelect = (isOwner: string) => {
    addUserMessage(isOwner);
    setFormData(prev => ({ ...prev, isOwner }));
    setTimeout(() => {
      addBotMessage("Please enter your contact number.");
      setCurrentStep("PHONE");
    }, 400);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone.trim());
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    setError("");
    const val = inputValue.trim();

    if (currentStep === "LIVE_CHAT") {
      if (!chatSessionId) return;
      const tempId = Date.now().toString() + Math.random();
      // Optimistic update
      setLiveMessages(prev => [...prev, { 
        id: tempId, 
        senderType: "VISITOR", 
        message: val, 
        createdAt: new Date().toISOString() 
      }]);
      setInputValue("");
      
      fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: chatSessionId, message: val })
      }).catch(console.error);
      return;
    }

    if (currentStep === "NAME") {
      addUserMessage(val);
      setFormData(prev => ({ ...prev, name: val }));
      setInputValue("");
      setTimeout(() => {
        addBotMessage(`Thanks, ${val}! What's your company name?`);
        setCurrentStep("COMPANY");
      }, 400);
    } 
    else if (currentStep === "COMPANY") {
      addUserMessage(val);
      setFormData(prev => ({ ...prev, company: val }));
      setInputValue("");
      setTimeout(() => {
        addBotMessage("Are you the owner of the company?");
        setCurrentStep("OWNER");
      }, 400);
    }
    else if (currentStep === "PHONE") {
      if (!validatePhone(val)) {
        setError("Please enter a valid phone number.");
        return;
      }
      addUserMessage(val);
      setFormData(prev => ({ ...prev, phone: val }));
      setInputValue("");
      setTimeout(() => {
        addBotMessage("What's your email address?");
        setCurrentStep("EMAIL");
      }, 400);
    }
    else if (currentStep === "EMAIL") {
      if (!validateEmail(val)) {
        setError("Please enter a valid email address.");
        return;
      }
      addUserMessage(val);
      setFormData(prev => ({ ...prev, email: val }));
      setInputValue("");
      setTimeout(() => {
        showConfirmation(val);
      }, 400);
    }
  };

  const showConfirmation = (emailVal: string) => {
    const currentData = { ...formData, email: emailVal };
    
    addBotMessage(
      <div className="space-y-3">
        <p>Please confirm your details:</p>
        <div className="bg-background/50 p-3 rounded-lg text-xs space-y-1">
          <p><span className="font-semibold">Service:</span> {currentData.service}</p>
          <p><span className="font-semibold">Name:</span> {currentData.name}</p>
          <p><span className="font-semibold">Company:</span> {currentData.company}</p>
          <p><span className="font-semibold">Owner:</span> {currentData.isOwner}</p>
          <p><span className="font-semibold">Contact:</span> {currentData.phone}</p>
          <p><span className="font-semibold">Email:</span> {currentData.email}</p>
        </div>
      </div>
    );
    setCurrentStep("CONFIRMATION");
  };

  const handleEdit = () => {
    addUserMessage("I want to edit my details.");
    setTimeout(() => {
      addBotMessage("Please select a service:");
      setCurrentStep("SERVICE");
      setFormData({
        service: "",
        name: "",
        company: "",
        isOwner: "",
        phone: "",
        email: ""
      });
    }, 400);
  };

  const handleSubmitLead = async () => {
    setCurrentStep("SUBMITTING");
    addUserMessage("Looks good, submit it!");
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          service: formData.service,
          message: `Owner: ${formData.isOwner}`,
          source: "Website Chatbot",
          pageUrl: typeof window !== 'undefined' ? window.location.href : "",
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.chatSessionId) {
          setChatSessionId(data.chatSessionId);
          sessionStorage.setItem("buzzspire_chat_session", data.chatSessionId);
          setCurrentStep("LIVE_WAITING");
        } else {
          setCurrentStep("SUCCESS");
          addBotMessage("Thank you! A BuzzSpire agent will reach out soon.");
        }
      } else {
        throw new Error(data.message || "Failed to submit");
      }
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        addBotMessage("Sorry, we couldn't submit your request right now. Please try again.");
        setCurrentStep("ERROR");
      }, 500);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              if (isPopupOpen) return;
              setIsOpen(true);
            }}
            className="fixed bottom-24 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center"
            aria-label="Open BuzzSpire Chat"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-32px)] h-[550px] max-h-[calc(100vh-120px)] bg-card border border-border/60 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-primary px-4 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground text-sm">BuzzSpire Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[10px] text-primary-foreground/80 uppercase tracking-wider font-medium">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {chatSessionId && currentStep !== "SUCCESS" && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1"
                      aria-label="Menu"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {showMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 bg-background border border-border shadow-lg rounded-xl py-1 w-32 z-50 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setShowMenu(false);
                              setShowEndConfirm(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted font-medium"
                          >
                            End Chat
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                {chatSessionId && currentStep !== "SUCCESS" && (
                  <a
                    href="tel:+919599249586"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1"
                    aria-label="Phone Call"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div data-lenis-prevent="true" className="flex-1 min-h-0 relative overflow-y-auto p-4 space-y-4 bg-muted/20">
              <AnimatePresence>
                {showEndConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
                  >
                    <div className="bg-card border border-border shadow-2xl rounded-2xl p-5 w-full max-w-[280px]">
                      <h4 className="font-semibold text-foreground mb-2">End this chat?</h4>
                      <p className="text-sm text-muted-foreground mb-5">
                        Are you sure you want to end this conversation?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowEndConfirm(false)}
                          className="flex-1 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={endChatSession}
                          className="flex-1 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                        >
                          End Chat
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!chatSessionId ? (
                // Original Onboarding Flow
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] ${
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-background border border-border shadow-sm rounded-tl-sm text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                // Live Chat Flow
                <>
                  <div className="text-[11px] text-center text-muted-foreground my-2">
                    Lead submitted successfully. Chat session started.
                  </div>
                  {liveMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.senderType === "VISITOR" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] ${
                          msg.senderType === "VISITOR" 
                            ? "bg-primary text-primary-foreground rounded-tr-sm" 
                            : msg.senderType === "SYSTEM"
                            ? "bg-muted text-muted-foreground text-[11px] italic mx-auto text-center"
                            : "bg-background border border-border shadow-sm rounded-tl-sm text-foreground"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              {!chatSessionId && currentStep === "SERVICE" && (
                <motion.div data-lenis-prevent="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2 mt-2 max-h-[250px] overflow-y-auto pr-1">
                  {servicesData.map(service => (
                    <button
                      key={service.slug}
                      onClick={() => handleServiceSelect(service.title)}
                      className="text-left px-3 py-2 bg-background border border-border hover:border-primary/50 hover:bg-primary/5 text-[14px] font-medium leading-normal rounded-lg transition-all shadow-sm shrink-0"
                    >
                      {service.title}
                    </button>
                  ))}
                </motion.div>
              )}

              {!chatSessionId && currentStep === "OWNER" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleOwnerSelect("Yes")}
                    className="flex-1 px-4 py-2 bg-background border border-border hover:border-primary/50 hover:bg-primary/5 text-[13px] rounded-xl transition-all font-medium text-center shadow-sm"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleOwnerSelect("No")}
                    className="flex-1 px-4 py-2 bg-background border border-border hover:border-primary/50 hover:bg-primary/5 text-[13px] rounded-xl transition-all font-medium text-center shadow-sm"
                  >
                    No
                  </button>
                </motion.div>
              )}

              {!chatSessionId && currentStep === "CONFIRMATION" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmitLead}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] rounded-xl transition-all font-semibold text-center shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Submit
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex-1 px-4 py-2.5 bg-background border border-border hover:bg-muted text-[13px] rounded-xl transition-all font-medium text-center shadow-sm"
                  >
                    Edit
                  </button>
                </motion.div>
              )}

              {!chatSessionId && currentStep === "SUBMITTING" && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              {currentStep === "LIVE_WAITING" && (
                <div className="flex justify-start mt-2 flex-col gap-2">
                  <div className="bg-background border border-border shadow-sm rounded-2xl rounded-tl-sm px-4 py-2.5 text-[13px] text-foreground">
                    Please wait while we connect you to a BuzzSpire agent...
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 px-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    You're in the queue. An agent will join shortly.
                  </div>
                </div>
              )}

              {!chatSessionId && currentStep === "ERROR" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmitLead}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] rounded-xl transition-all font-medium text-center shadow-sm"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {(["NAME", "COMPANY", "PHONE", "EMAIL", "LIVE_CHAT"].includes(currentStep)) && (
              <div className="p-3 bg-background border-t border-border shrink-0">
                {error && (
                  <p className="text-destructive text-[11px] mb-2 px-1">{error}</p>
                )}
                <form onSubmit={handleTextSubmit} className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type={currentStep === "EMAIL" ? "email" : currentStep === "PHONE" ? "tel" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-muted/50 border border-border rounded-full pl-4 pr-12 py-2.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
