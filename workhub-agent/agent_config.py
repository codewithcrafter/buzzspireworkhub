import os
import json
import uuid
import socket
import sys
import tempfile

AGENT_VERSION = "0.1.0"

if getattr(sys, 'frozen', False):
    OLD_BASE_DIR = os.path.dirname(sys.executable)
else:
    OLD_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LOCAL_APP_DATA = os.environ.get("LOCALAPPDATA")
if not LOCAL_APP_DATA:
    LOCAL_APP_DATA = os.path.join(os.environ.get("USERPROFILE", os.path.expanduser("~")), "AppData", "Local")

APP_DATA_DIR = os.path.join(LOCAL_APP_DATA, "BuzzSpireWorkHub")
CONFIG_FILE = os.path.join(APP_DATA_DIR, "agent_config.json")

def get_old_config_paths():
    paths = []
    cwd_path = os.path.abspath("agent_config.json")
    base_path = os.path.join(OLD_BASE_DIR, "agent_config.json")
    if cwd_path not in paths:
        paths.append(cwd_path)
    if base_path not in paths:
        paths.append(base_path)
    return paths

class Config:
    def __init__(self):
        if getattr(sys, 'frozen', False):
            self.server_url = "https://employee.buzzspiremedia.com"
        else:
            self.server_url = "http://localhost:3000"
        
        self.device_id = str(uuid.uuid4())
        self.device_name = socket.gethostname()
        self.credential = None
        self.employee_id = None
        self.heartbeat_interval = 10
        self.event_batch_interval = 5
        self.idle_threshold_seconds = 5 # Windows idle time before tracking as IDLE_STATE
        self.load()

    def _ensure_dir(self):
        try:
            os.makedirs(APP_DATA_DIR, exist_ok=True)
        except Exception as e:
            print(f"Error creating config directory: {e}")

    def load(self):
        self._ensure_dir()
        loaded_data = None
        
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    loaded_data = json.load(f)
            except Exception as e:
                print(f"Error reading config {CONFIG_FILE}: {e}")
        else:
            for old_path in get_old_config_paths():
                if os.path.exists(old_path):
                    try:
                        with open(old_path, "r", encoding="utf-8") as f:
                            loaded_data = json.load(f)
                            print(f"Migrating config from {old_path}")
                        break
                    except Exception as e:
                        print(f"Error reading old config {old_path}: {e}")

        if loaded_data:
            self.server_url = loaded_data.get("server_url", self.server_url)
            self.device_id = loaded_data.get("device_id", self.device_id)
            self.credential = loaded_data.get("credential", self.credential)
            self.employee_id = loaded_data.get("employee_id", self.employee_id)
            
        self.save()

    def save(self):
        self._ensure_dir()
        data = {
            "server_url": self.server_url,
            "device_id": self.device_id,
            "credential": self.credential,
            "employee_id": self.employee_id,
        }
        
        try:
            fd, tmp_path = tempfile.mkstemp(dir=APP_DATA_DIR, prefix="agent_config_", suffix=".tmp")
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
                f.flush()
                os.fsync(f.fileno())
            os.replace(tmp_path, CONFIG_FILE)
        except Exception as e:
            print(f"Failed to safely save config: {e}")
            try:
                if 'tmp_path' in locals() and os.path.exists(tmp_path):
                    os.remove(tmp_path)
            except:
                pass

config = Config()
