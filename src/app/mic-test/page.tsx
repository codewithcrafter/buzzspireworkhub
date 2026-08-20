"use client";
import React, { useState, useEffect } from 'react';

export default function MicTestPage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog(prev => [...prev, msg]);
  };

  const runTest = async () => {
    try {
      addLog(`isSecureContext: ${window.isSecureContext}`);
      addLog(`typeof navigator.mediaDevices: ${typeof navigator.mediaDevices}`);
      
      if (navigator.permissions && navigator.permissions.query) {
        const perm = await navigator.permissions.query({ name: "microphone" as PermissionName });
        addLog(`Permission state: ${perm.state}`);
      } else {
        addLog(`navigator.permissions.query not supported`);
      }

      addLog(`Requesting getUserMedia...`);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog(`getUserMedia SUCCESS! Tracks: ${stream.getAudioTracks().length}`);
      
      // Cleanup immediately
      stream.getTracks().forEach(t => t.stop());
      addLog(`Stream tracks stopped.`);
    } catch (e: any) {
      addLog(`getUserMedia FAILED: ${e.name} - ${e.message}`);
    }
  };

  return (
    <div style={{ padding: 50, fontFamily: 'monospace' }}>
      <h1>Microphone Test</h1>
      <button 
        onClick={runTest}
        style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer', marginBottom: 20 }}
      >
        Run Test
      </button>
      <div style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 20, borderRadius: 5, color: '#333' }}>
        {log.join('\n')}
      </div>
    </div>
  );
}
