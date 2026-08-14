"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const POPUP_STORAGE_KEY = "buzzspire_lead_popup_status";

export default function LeadPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    // Check local storage for persistence
    try {
      const stored = localStorage.getItem(POPUP_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.expiresAt && parsed.expiresAt > Date.now()) {
          // Do not show if valid expiration is found
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to parse popup storage", e);
    }

    // Set timeout to show after 3 seconds
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    // If not successfully submitted, hide for 24 hours
    if (!isSuccess) {
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify({ status: "closed", expiresAt }));
    }
  };

  const handleSuccessClose = () => {
    setShow(false);
    // Hide for 7 days
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify({ status: "submitted", expiresAt }));
  };

  const validateIndianPhone = (input: string) => {
    const cleaned = input.trim().replace(/[\s\-()]/g, "");
    // Matches Indian numbers: optional +91/91/0 prefix followed by 10 digits starting with 6, 7, 8, or 9
    return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setPhoneError("");

    // Validate phone number
    if (!validateIndianPhone(phone)) {
      setPhoneError("Please enter a valid 10-digit Indian phone number (e.g. +91-9876543210)");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          source: "Website Popup",
          pageUrl: window.location.href,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to submit. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4 md:p-6"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[550px] bg-white border border-border shadow-2xl rounded-3xl overflow-hidden relative z-[100]"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSuccess ? (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="bg-primary/5 px-8 pt-10 pb-6 text-center border-b border-border/50">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                      Free Strategy Consultation
                    </span>
                    <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground tracking-tight mb-2">
                      Ready to Scale Your Revenue?
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Drop your details below and our growth team will connect with you shortly.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                          Name <span className="text-primary font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Rajesh Kumar"
                          className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                          Email <span className="text-primary font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rajesh.kumar@example.com"
                          className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        Phone <span className="text-primary font-bold">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError("");
                        }}
                        placeholder="+91-9876543210"
                        className={`w-full bg-muted/30 border ${phoneError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-border/50'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                      />
                      {phoneError && (
                        <p className="text-xs text-red-500 font-medium">{phoneError}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        What do you need help with? <span className="text-primary font-bold">*</span>
                      </label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="I'm looking for SEO and Paid Ads..."
                        rows={3}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-sm text-red-500 text-center font-medium">{errorMsg}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl py-6 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 shadow-md transition-all mt-4"
                    >
                      {isSubmitting ? (
                        "Sending Request..."
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-heading font-extrabold text-foreground mb-3">
                    Request Received!
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                    Thanks for reaching out! Our team will get back to you shortly to discuss your growth goals.
                  </p>
                  <Button
                    onClick={handleSuccessClose}
                    className="rounded-full px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90"
                  >
                    Close Window
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
