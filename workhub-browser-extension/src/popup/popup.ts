function uuidv4() {
  // @ts-ignore
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  const unauthView = document.getElementById('unauth-view') as HTMLDivElement;
  const authView = document.getElementById('auth-view') as HTMLDivElement;
  
  const serverUrlInput = document.getElementById('server-url') as HTMLInputElement;
  const tokenInput = document.getElementById('enroll-token') as HTMLInputElement;
  const btnConnect = document.getElementById('btn-connect') as HTMLButtonElement;
  const errorMsg = document.getElementById('connect-error') as HTMLDivElement;

  const employeeName = document.getElementById('employee-name') as HTMLSpanElement;
  const deviceName = document.getElementById('device-name') as HTMLSpanElement;
  const statusIndicator = document.getElementById('status-indicator') as HTMLSpanElement;
  const lastSync = document.getElementById('last-sync') as HTMLSpanElement;

  const btnTest = document.getElementById('btn-test') as HTMLButtonElement;
  const btnSync = document.getElementById('btn-sync') as HTMLButtonElement;
  const btnPrivacy = document.getElementById('btn-privacy') as HTMLButtonElement;
  const btnDisconnect = document.getElementById('btn-disconnect') as HTMLButtonElement;

  // Check state
  const state = await chrome.storage.local.get(['credential', 'serverUrl', 'deviceId', 'employeeName', 'deviceName', 'lastSync']);
  
  if (state.credential) {
    unauthView.style.display = 'none';
    authView.style.display = 'block';
    employeeName.textContent = state.employeeName || 'Unknown';
    deviceName.textContent = state.deviceName || state.deviceId;
    
    if (state.lastSync) {
      lastSync.textContent = new Date(state.lastSync).toLocaleTimeString();
    }
  }

  btnConnect.addEventListener('click', async () => {
    errorMsg.style.display = 'none';
    const serverUrl = serverUrlInput.value.trim().replace(/\/$/, "");
    const token = tokenInput.value.trim();

    if (!serverUrl || !token) {
      errorMsg.textContent = 'Please enter both Server URL and Token.';
      errorMsg.style.display = 'block';
      return;
    }

    btnConnect.disabled = true;
    btnConnect.textContent = 'Connecting...';

    try {
      const deviceId = uuidv4();
      let browserInfo = "Browser Extension";
      try {
        // @ts-ignore (navigator.userAgentData is chromium specific)
        const ua = navigator.userAgentData;
        if (ua && ua.brands && ua.brands.length > 0) {
          browserInfo = ua.brands[0].brand + " Extension";
        }
      } catch (e) {}

      const res = await fetch(`${serverUrl}/api/activity/agent/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          deviceId,
          deviceName: browserInfo
        })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        await chrome.storage.local.set({
          credential: data.credential,
          deviceId: deviceId,
          serverUrl: serverUrl,
          employeeName: data.employeeName,
          deviceName: browserInfo,
          lastSync: Date.now()
        });

        // Trigger background worker to re-read config
        chrome.runtime.sendMessage({ type: "CONFIG_UPDATED" });

        unauthView.style.display = 'none';
        authView.style.display = 'block';
        
        employeeName.textContent = data.employeeName;
        deviceName.textContent = browserInfo;
        lastSync.textContent = new Date().toLocaleTimeString();
      } else {
        errorMsg.textContent = data.error || 'Enrollment failed.';
        errorMsg.style.display = 'block';
      }
    } catch (err: any) {
      errorMsg.textContent = 'Network error: ' + err.message;
      errorMsg.style.display = 'block';
    } finally {
      btnConnect.disabled = false;
      btnConnect.textContent = 'Connect';
    }
  });

  btnTest.addEventListener('click', async () => {
    const s = await chrome.storage.local.get(['serverUrl', 'credential']);
    if (!s.serverUrl || !s.credential) return;

    try {
      const res = await fetch(`${s.serverUrl}/api/activity/agent/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${s.credential}`
        },
        body: JSON.stringify({ agentVersion: chrome.runtime.getManifest().version })
      });
      if (res.ok) {
        alert("Connection successful!");
      } else {
        alert("Connection failed (or revoked). Status: " + res.status);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  });

  btnSync.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "FORCE_SYNC" });
    alert("Sync triggered in background.");
  });

  btnPrivacy.addEventListener('click', () => {
    alert("Privacy Policy:\n\nThis extension only tracks the hostname (e.g. github.com) of the active tab. It does not track full URLs, page contents, keystrokes, or any private data. Tracking stops automatically when the browser is minimized or idle.");
  });

  btnDisconnect.addEventListener('click', async () => {
    if (confirm("Are you sure you want to disconnect? All local data will be cleared.")) {
      await chrome.storage.local.clear();
      chrome.runtime.sendMessage({ type: "CONFIG_UPDATED" });
      authView.style.display = 'none';
      unauthView.style.display = 'block';
      tokenInput.value = '';
    }
  });

  // Update last sync time if message received
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SYNC_COMPLETED") {
      lastSync.textContent = new Date(msg.timestamp).toLocaleTimeString();
    }
  });
});
