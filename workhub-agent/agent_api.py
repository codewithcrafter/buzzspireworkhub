import requests
from agent_config import config, AGENT_VERSION
from agent_storage import storage
import time

class ApiClient:
    def headers(self):
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {config.credential}" if config.credential else ""
        }

    def enroll(self, token):
        try:
            url = f"{config.server_url}/api/activity/agent/enroll"
            res = requests.post(url, json={
                "token": token,
                "deviceId": config.device_id,
                "deviceName": config.device_name
            }, timeout=60)
            if res.status_code == 200:
                data = res.json()
                if data.get("success"):
                    config.credential = data["data"]["credential"]
                    config.employee_id = data["data"]["employeeId"]
                    config.save()
                    return True, data["data"]
            return False, res.json().get("error", "Unknown error")
        except Exception as e:
            return False, str(e)

    def heartbeat(self, os_idle_seconds=0):
        if not config.credential:
            return "unauthorized"
        try:
            url = f"{config.server_url}/api/activity/agent/heartbeat"
            res = requests.post(url, headers=self.headers(), json={
                "agentVersion": AGENT_VERSION,
                "osIdleSeconds": os_idle_seconds
            }, timeout=60)
            if res.status_code in [401, 403]:
                return "revoked"
            elif res.status_code == 200:
                return "ok"
            else:
                return "unreachable"
        except requests.exceptions.RequestException:
            return "unreachable"
        except Exception:
            return "unreachable"

    def sync_events(self):
        if not config.credential:
            return "unauthorized"
        batch = storage.get_batch(50)
        if not batch:
            return "ok"
        
        try:
            url = f"{config.server_url}/api/activity/agent/events"
            res = requests.post(url, headers=self.headers(), json={
                "events": batch
            }, timeout=60)
            
            if res.status_code == 200 and res.json().get("success"):
                storage.remove_batch(len(batch))
                return "ok"
            elif res.status_code in [401, 403]:
                # Credential revoked or invalid.
                return "revoked"
            return "unreachable"
        except Exception:
            # Network issue, leave in queue
            return "unreachable"

api = ApiClient()
