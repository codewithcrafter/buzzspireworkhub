let config = {
  credential: "",
  serverUrl: "",
  deviceId: ""
};

let activeDomain: string | null = null;
let activeStartTime: number | null = null;
let isBrowserActive = true;
let isIdle = false;
let syncInterval: any = null;

const BATCH_INTERVAL_MS = 30000;
const AGENT_VERSION = chrome.runtime.getManifest().version;

// Initialize
async function loadConfig() {
  const data = await chrome.storage.local.get(['credential', 'serverUrl', 'deviceId']);
  config.credential = data.credential || "";
  config.serverUrl = data.serverUrl || "";
  config.deviceId = data.deviceId || "";
  
  if (config.credential && !syncInterval) {
    syncInterval = setInterval(syncQueue, BATCH_INTERVAL_MS);
    // Initial sync
    syncQueue();
  } else if (!config.credential && syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

// Ensure init
loadConfig();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CONFIG_UPDATED") {
    loadConfig();
  } else if (msg.type === "FORCE_SYNC") {
    syncQueue();
  }
});

// Helper to sanitize URL to domain
function extractDomain(url: string | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) return null;
  try {
    const u = new URL(url);
    return u.hostname.toLowerCase();
  } catch (e) {
    return null;
  }
}

async function logActivity(domain: string, startTs: number, endTs: number) {
  const duration = Math.floor((endTs - startTs) / 1000);
  if (duration <= 0) return;

  const event = {
    eventType: "WEBSITE_ACTIVITY",
    domain: domain,
    startedAt: new Date(startTs).toISOString(),
    endedAt: new Date(endTs).toISOString(),
    durationSeconds: duration,
    source: "BROWSER_EXTENSION",
    timestamp: new Date().toISOString()
  };

  const state = await chrome.storage.local.get(['eventQueue']);
  const queue = state.eventQueue || [];
  queue.push(event);
  
  // Cap at 1000 events to prevent massive storage bloat
  if (queue.length > 1000) {
    queue.shift(); 
  }
  
  await chrome.storage.local.set({ eventQueue: queue });
}

function handleContextChange(newUrl: string | undefined) {
  if (!isBrowserActive || isIdle) {
    if (activeDomain && activeStartTime) {
      logActivity(activeDomain, activeStartTime, Date.now());
      activeDomain = null;
      activeStartTime = null;
    }
    return;
  }

  const newDomain = extractDomain(newUrl);

  if (activeDomain !== newDomain) {
    const now = Date.now();
    
    // Close old
    if (activeDomain && activeStartTime) {
      logActivity(activeDomain, activeStartTime, now);
    }
    
    // Start new
    activeDomain = newDomain;
    activeStartTime = newDomain ? now : null;
  }
}

// Track active tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleContextChange(tab.url);
});

// Track url updates on the current active tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // Only care if this tab is the active one in the current window
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab && activeTab.id === tabId) {
      handleContextChange(changeInfo.url);
    }
  }
});

// Track window focus
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    isBrowserActive = false;
    handleContextChange(undefined); // Will trigger flush
  } else {
    isBrowserActive = true;
    const [activeTab] = await chrome.tabs.query({ active: true, windowId: windowId });
    if (activeTab) {
      handleContextChange(activeTab.url);
    }
  }
});

// Track idle state (pauses tracking if computer locked/idle)
chrome.idle.setDetectionInterval(60); // 60 seconds
chrome.idle.onStateChanged.addListener(async (newState) => {
  if (newState === 'idle' || newState === 'locked') {
    isIdle = true;
    handleContextChange(undefined);
  } else if (newState === 'active') {
    isIdle = false;
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab) {
      handleContextChange(activeTab.url);
    }
  }
});

// Sync logic
let isSyncing = false;
async function syncQueue() {
  if (!config.credential || !config.serverUrl) return;
  if (isSyncing) return;
  
  isSyncing = true;
  try {
    const state = await chrome.storage.local.get(['eventQueue']);
    const queue = state.eventQueue || [];
    
    // Send heartbeat first
    try {
      await fetch(`${config.serverUrl}/api/activity/agent/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.credential}`
        },
        body: JSON.stringify({ agentVersion: AGENT_VERSION })
      });
    } catch(e) {}

    if (queue.length === 0) {
      isSyncing = false;
      return;
    }

    const batch = queue.slice(0, 50); // Sync max 50 at a time

    const res = await fetch(`${config.serverUrl}/api/activity/agent/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.credential}`
      },
      body: JSON.stringify({ events: batch })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Remove synced
        const newState = await chrome.storage.local.get(['eventQueue']);
        const currentQueue = newState.eventQueue || [];
        currentQueue.splice(0, batch.length);
        
        const now = Date.now();
        await chrome.storage.local.set({ 
          eventQueue: currentQueue,
          lastSync: now 
        });
        
        // Notify popup
        chrome.runtime.sendMessage({ type: "SYNC_COMPLETED", timestamp: now }).catch(()=> {});
      }
    }
  } catch (err) {
    // Network error, will retry next interval
  } finally {
    isSyncing = false;
  }
}
