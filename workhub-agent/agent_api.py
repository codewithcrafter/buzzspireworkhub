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
                    return True, "Enrolled successfully"
            return False, res.json().get("error", "Unknown error")
        except Exception as e:
            return False, str(e)

    def heartbeat(self):
        if not config.credential:
            return
        try:
            url = f"{config.server_url}/api/activity/agent/heartbeat"
            requests.post(url, headers=self.headers(), json={
                "agentVersion": AGENT_VERSION
            }, timeout=60)
        except:
            pass

    def sync_events(self):
        if not config.credential:
            return
        batch = storage.get_batch(50)
        if not batch:
            return
        
        try:
            url = f"{config.server_url}/api/activity/agent/events"
            res = requests.post(url, headers=self.headers(), json={
                "events": batch
            }, timeout=60)
            
            if res.status_code == 200 and res.json().get("success"):
                storage.remove_batch(len(batch))
            elif res.status_code in [401, 403]:
                # Credential revoked or invalid. Stop syncing to prevent spam.
                print("Credential invalid. Please re-enroll.")
        except Exception as e:
            # Network issue, leave in queue
            pass

api = ApiClient()
