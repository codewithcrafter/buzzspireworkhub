import time
import threading
from datetime import datetime, timezone
from agent_config import config
from agent_storage import storage
from agent_api import api
from agent_collectors import get_active_window_info, get_idle_time_seconds, current_iso

class AgentDaemon:
    def __init__(self):
        self.running = False
        self.current_app = None
        self.current_title = None
        self.app_start_time = None
        
        self.is_idle = False
        self.idle_start_time = None

    def start(self):
        self.running = True
        
        # Start background threads
        threading.Thread(target=self.heartbeat_loop, daemon=True).start()
        threading.Thread(target=self.sync_loop, daemon=True).start()
        
        print(f"BuzzSpire WorkHub Agent Started")
        print(f"Device ID: {config.device_id}")
        
        self.monitor_loop()

    def record_app_event(self):
        if self.current_app and self.app_start_time:
            now = datetime.now(timezone.utc)
            duration = (now - self.app_start_time).total_seconds()
            if duration >= 1: # Ignore micro-flips
                storage.enqueue({
                    "eventType": "APPLICATION_ACTIVITY",
                    "applicationName": self.current_app,
                    "windowTitle": self.current_title,
                    "startedAt": self.app_start_time.isoformat(),
                    "endedAt": now.isoformat(),
                    "durationSeconds": int(duration),
                    "timestamp": now.isoformat()
                })

    def record_idle_event(self):
        if self.idle_start_time:
            now = datetime.now(timezone.utc)
            duration = (now - self.idle_start_time).total_seconds()
            storage.enqueue({
                "eventType": "IDLE_STATE",
                "state": "IDLE",
                "startedAt": self.idle_start_time.isoformat(),
                "endedAt": now.isoformat(),
                "durationSeconds": int(duration),
                "timestamp": now.isoformat()
            })

    def monitor_loop(self):
        while self.running:
            try:
                idle_sec = get_idle_time_seconds()
                
                # Handle Idle State Transitions
                if idle_sec >= config.idle_threshold_seconds and not self.is_idle:
                    self.is_idle = True
                    self.idle_start_time = datetime.now(timezone.utc)
                    # Close current app session because user is now idle
                    self.record_app_event()
                    self.current_app = None
                    
                elif idle_sec < config.idle_threshold_seconds and self.is_idle:
                    self.is_idle = False
                    self.record_idle_event()
                    self.idle_start_time = None

                # If not idle, track active window
                if not self.is_idle:
                    app_name, title = get_active_window_info()
                    if app_name:
                        if app_name != self.current_app or title != self.current_title:
                            # Context switch
                            self.record_app_event()
                            self.current_app = app_name
                            self.current_title = title
                            self.app_start_time = datetime.now(timezone.utc)
                            
            except Exception as e:
                print(f"Monitor error: {e}")
                
            time.sleep(1)

    def heartbeat_loop(self):
        while self.running:
            api.heartbeat()
            time.sleep(config.heartbeat_interval)

    def sync_loop(self):
        while self.running:
            api.sync_events()
            time.sleep(config.event_batch_interval)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "enroll":
        if len(sys.argv) < 3:
            print("Usage: python agent_main.py enroll <TOKEN>")
            sys.exit(1)
        token = sys.argv[2]
        success, msg = api.enroll(token)
        print(msg)
        if not success:
            sys.exit(1)
        sys.exit(0)
    
    if not config.credential:
        print("Agent is not enrolled. Run: python agent_main.py enroll <TOKEN>")
        sys.exit(1)
        
    daemon = AgentDaemon()
    try:
        daemon.start()
    except KeyboardInterrupt:
        daemon.running = False
        print("Stopping agent...")
