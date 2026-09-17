import os
import json
import uuid
import socket

AGENT_VERSION = "0.1.0"
CONFIG_FILE = "agent_config.json"

class Config:
    def __init__(self):
        self.server_url = "http://localhost:3000"
        self.device_id = str(uuid.uuid4())
        self.device_name = socket.gethostname()
        self.credential = None
        self.employee_id = None
        self.heartbeat_interval = 10
        self.event_batch_interval = 5
        self.idle_threshold_seconds = 5 # Windows idle time before tracking as IDLE_STATE
        self.load()

    def load(self):
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r") as f:
                    data = json.load(f)
                    self.server_url = data.get("server_url", self.server_url)
                    self.device_id = data.get("device_id", self.device_id)
                    self.credential = data.get("credential", self.credential)
                    self.employee_id = data.get("employee_id", self.employee_id)
            except:
                pass
        self.save()

    def save(self):
        with open(CONFIG_FILE, "w") as f:
            json.dump({
                "server_url": self.server_url,
                "device_id": self.device_id,
                "credential": self.credential,
                "employee_id": self.employee_id,
            }, f, indent=2)

config = Config()
