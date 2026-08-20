const fs = require('fs');

let content = fs.readFileSync('src/components/chat/LeadChatbot.tsx', 'utf-8');

// Add imports
content = content.replace(
  'import { MessageSquare, X, Send, User, Bot, CheckCircle2, Phone } from "lucide-react";',
  'import { MessageSquare, X, Send, User, Bot, CheckCircle2, Phone, Mic, MicOff, PhoneOff } from "lucide-react";'
);

// Add state variables
content = content.replace(
  'const [activeCallId, setActiveCallId] = useState<string | null>(null);',
  `const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [rtcConnectionState, setRtcConnectionState] = useState<string>("new");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);`
);

// Add cleanup effect
content = content.replace(
  '// Scroll to bottom',
  `// WebRTC Cleanup
  useEffect(() => {
    return () => {
      handleEndCallLocally();
    };
  }, []);

  // Scroll to bottom`
);

// Rewrite polling for signals
const oldPolling = `  // Polling for Signals
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCallId && chatSessionId) {
      let lastSignalDate = new Date().toISOString();
      const fetchSignals = async () => {
        try {
          const res = await fetch(\`/api/chat/voice/\${activeCallId}/signal?sessionId=\${chatSessionId}&since=\${lastSignalDate}\`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.signals && data.signals.length > 0) {
              console.log("Visitor received WebRTC signals:", data.signals);
              lastSignalDate = new Date().toISOString();
            }
            if (data.status && data.status !== "ACTIVE") {
              setActiveCallId(null); // Stop polling if call ended
            }
          }
        } catch (e) {
          console.error("Signal polling error:", e);
        }
      };
      interval = setInterval(fetchSignals, 2000);
    }
    return () => clearInterval(interval);
  }, [activeCallId, chatSessionId]);`;

const newPolling = `  const handleEndCallLocally = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    candidateQueue.current = [];
    setActiveCallId(null);
    setRtcConnectionState("closed");
  };

  const endVoiceCall = async () => {
    if (activeCallId && chatSessionId) {
      fetch(\`/api/chat/voice/\${activeCallId}/end\`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: chatSessionId })
      }).catch(console.error);
    }
    handleEndCallLocally();
    setLiveMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderType: "SYSTEM",
      message: "Call ended.",
      createdAt: new Date().toISOString()
    }]);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const setupWebRTCVisitor = async (callId: string, sid: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });
      pcRef.current = pc;

      pc.oniceconnectionstatechange = () => {
        setRtcConnectionState(pc.iceConnectionState);
        if (pc.iceConnectionState === "connected") {
          setCallDuration(0);
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
          }, 1000);
        } else if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed" || pc.iceConnectionState === "closed") {
          handleEndCallLocally();
        }
      };

      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current.play().catch(console.error);
        }
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await fetch(\`/api/chat/voice/\${callId}/signal\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: sid, type: "candidate", payload: event.candidate })
          }).catch(console.error);
        }
      };

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await fetch(\`/api/chat/voice/\${callId}/signal\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, type: "offer", payload: offer })
      });
      
    } catch (error) {
      console.error("WebRTC Setup Error:", error);
      handleEndCallLocally();
      setLiveMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderType: "SYSTEM",
        message: "We couldn't establish the voice connection. You can continue chatting with our team.",
        createdAt: new Date().toISOString()
      }]);
    }
  };

  // Polling for Signals & WebRTC Init
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCallId && chatSessionId) {
      if (!pcRef.current) {
        setupWebRTCVisitor(activeCallId, chatSessionId);
      }
      let lastSignalDate = new Date(Date.now() - 3000).toISOString();
      
      const fetchSignals = async () => {
        try {
          const res = await fetch(\`/api/chat/voice/\${activeCallId}/signal?sessionId=\${chatSessionId}&since=\${lastSignalDate}\`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.signals && data.signals.length > 0) {
              lastSignalDate = new Date().toISOString();
              
              for (const signal of data.signals) {
                if (signal.senderType === "AGENT" && pcRef.current) {
                  if (signal.type === "answer") {
                    try {
                      await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal.payload));
                      while (candidateQueue.current.length > 0) {
                         const candidate = candidateQueue.current.shift();
                         if (candidate) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                      }
                    } catch (err) { console.error("Error setting remote description", err); }
                  } else if (signal.type === "candidate") {
                    try {
                      if (pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
                        await pcRef.current.addIceCandidate(new RTCIceCandidate(signal.payload));
                      } else {
                        candidateQueue.current.push(signal.payload);
                      }
                    } catch (err) { console.error("Error adding candidate", err); }
                  }
                }
              }
            }
            if (data.status && data.status !== "ACTIVE" && data.status !== "RINGING") {
              handleEndCallLocally();
            }
          }
        } catch (e) {
          console.error("Signal polling error:", e);
        }
      };
      interval = setInterval(fetchSignals, 1500);
    }
    return () => clearInterval(interval);
  }, [activeCallId, chatSessionId]);`;

content = content.replace(oldPolling, newPolling);

const activeUI = `              {activeCallId && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex flex-col gap-3 mt-2 mb-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                        {rtcConnectionState === "connected" && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">BuzzSpire Agent</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          {rtcConnectionState === "connected" ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                              Connected • {formatTime(callDuration)}
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Connecting...
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleMute}
                      className={\`flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors \${isMuted ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-background border border-border text-foreground hover:bg-muted'}\`}
                    >
                      {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                    <button 
                      onClick={endVoiceCall}
                      className="flex-1 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <PhoneOff className="w-3.5 h-3.5" /> End Call
                    </button>
                  </div>
                </div>
              )}
              
              {!chatSessionId && currentStep === "SERVICE" && (`;

content = content.replace('              {!chatSessionId && currentStep === "SERVICE" && (', activeUI);

content = content.replace(
  '              {activeCallId && (',
  `const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return \\\`\${m}:\${s}\\\`;
};

              {activeCallId && (`
);

// Add hidden audio element at the bottom of the AnimatePresence wrapper
content = content.replace('            {/* Input Area */}', '            <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />\\n            {/* Input Area */}');

// Hide Call button if there is an active call
content = content.replace(
  '<Phone className="w-5 h-5" />',
  '{activeCallId ? <PhoneOff className="w-5 h-5 opacity-50" /> : <Phone className="w-5 h-5" />}'
);
content = content.replace(
  'onClick={handleCall}',
  'onClick={activeCallId ? endVoiceCall : handleCall}'
);

fs.writeFileSync('src/components/chat/LeadChatbot.tsx', content);
