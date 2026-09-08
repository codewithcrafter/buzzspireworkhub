"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Calendar, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown, NotificationItem } from "@/components/ui/notification-dropdown";
import { Dialog } from "@/components/ui/dialog";

// Global audio context for unlocking
let globalAudioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!globalAudioCtx) {
    try {
      globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
      return;
    }
  }
  if (globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume();
  }
};

const playNotificationSound = () => {
  try {
    if (!globalAudioCtx) return;
    if (globalAudioCtx.state === "suspended") {
      // If still suspended, we try one last time, though it requires user gesture
      globalAudioCtx.resume();
    }

    const osc = globalAudioCtx.createOscillator();
    const gainNode = globalAudioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, globalAudioCtx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, globalAudioCtx.currentTime + 0.1); // Slide to A6

    gainNode.gain.setValueAtTime(0, globalAudioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, globalAudioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(globalAudioCtx.destination);
    
    osc.start();
    osc.stop(globalAudioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio autoplay blocked or unsupported", e);
  }
};

export function ReminderNotifications() {
  const [show, setShow] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const [activeReminders, setActiveReminders] = useState<any[]>([]);
  const currentlyShowingId = useRef<string | null>(null);
  
  const router = useRouter();

  const fetchDueReminders = async () => {
    try {
      const res = await fetch("/api/admin/reminders?due=true");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reminders) {
          setReminders(data.reminders);
          
          if (data.reminders.length > 0) {
            setActiveReminders((prev) => {
              const newQueue = [...prev];
              let changed = false;
              for (const rem of data.reminders) {
                if (!newQueue.find((r) => r.id === rem.id)) {
                  newQueue.push(rem);
                  changed = true;
                }
              }
              return changed ? newQueue : prev;
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAsNotified = async (reminder: any) => {
    try {
      await fetch(`/api/admin/reminders/${reminder.id}/notified`, {
        method: "PATCH",
      });
    } catch (e) {
      console.error("Failed to mark reminder as notified", e);
    }
  };

  const handleIgnore = (reminder: any) => {
    markAsNotified(reminder);
    setActiveReminders((prev) => prev.slice(1));
  };

  const handleSeeDetails = (reminder: any) => {
    markAsNotified(reminder);
    setActiveReminders((prev) => prev.slice(1));
    if (reminder.leadId) {
      router.push(`/employee/leads?leadId=${reminder.leadId}`);
    }
  };

  useEffect(() => {
    if (activeReminders.length > 0) {
      const current = activeReminders[0];
      if (current.id !== currentlyShowingId.current) {
        currentlyShowingId.current = current.id;
        
        // 1. Play sound once per reminder appearance
        playNotificationSound();

        // 2. Show Browser Notification if permitted
        if ("Notification" in window && Notification.permission === "granted") {
          const nativeNotif = new Notification(`Reminder: ${current.lead?.name || 'Lead'}`, {
            body: current.title,
            icon: "/icon.png",
          });
          nativeNotif.onclick = () => {
            handleSeeDetails(current);
            nativeNotif.close();
            window.focus();
          };
        }
      }
    } else {
      currentlyShowingId.current = null;
    }
  }, [activeReminders]);

  useEffect(() => {
    // Attach audio unlocker to first user interaction
    const unlockAudio = () => {
      initAudio();
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    // Request browser notification permission if desired
    if ("Notification" in window && Notification.permission === "default") {
      // Just check, don't forcefully prompt on load to avoid spamming the user. 
    }

    fetchDueReminders();
    const interval = setInterval(fetchDueReminders, 15000); // Check every 15 seconds
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const notifications: NotificationItem[] = reminders.map((rem) => ({
    id: rem.id,
    title: rem.title,
    description: rem.note || `Reminder for lead: ${rem.lead?.name || 'Unknown'}`,
    time: new Date(rem.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    unread: true,
    type: "task",
  }));

  const handleMarkAllRead = async () => {
    setShow(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-muted/80 cursor-pointer text-foreground bg-card shadow-sm border border-border"
        onClick={() => setShow(!show)}
      >
        <Bell className="size-5" />
        <span className="absolute top-0 right-0 flex size-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
        </span>
      </Button>

      {show && (
        <div className="absolute right-0 mt-2 w-80 z-50 animate-in fade-in slide-in-from-top-3">
          <NotificationDropdown
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onItemClick={(id) => setShow(false)}
          />
        </div>
      )}

      {/* Centered Reminder Modal */}
      {activeReminders.length > 0 && (
        <Dialog
          isOpen={true}
          onClose={() => handleIgnore(activeReminders[0])}
          title="🔔 Reminder Due"
          size="sm"
          footer={
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => handleIgnore(activeReminders[0])}
                className="rounded-xl flex-1 sm:flex-none cursor-pointer"
              >
                Ignore Reminder
              </Button>
              <Button
                onClick={() => handleSeeDetails(activeReminders[0])}
                className="rounded-xl flex-1 sm:flex-none bg-primary text-white cursor-pointer shadow-sm"
              >
                See Client Details
              </Button>
            </div>
          }
        >
          <div className="space-y-4 py-2">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {activeReminders[0].title}
              </h3>
            </div>

            <div className="bg-muted/40 p-4 rounded-xl border border-border/60 space-y-3">
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {activeReminders[0].lead?.name || "Unknown Lead"}
                  </p>
                  {activeReminders[0].lead?.company && (
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {activeReminders[0].lead?.company}
                    </p>
                  )}
                </div>
              </div>

              {activeReminders[0].note && (
                <div className="flex items-start gap-2 pt-2 border-t border-border/40">
                  <FileText className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {activeReminders[0].note}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium pt-2">
              <Clock className="size-3.5" />
              <span>
                {new Date(activeReminders[0].dueDate).toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                ,{" "}
                {new Date(activeReminders[0].dueDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
