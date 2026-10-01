import os
import urllib.request
import requests
from agent_config import config, AGENT_VERSION
from agent_storage import storage
import time

class ApiClient:
    def __init__(self):
        self.session = requests.Session()
        self.session.trust_env = False
        self.session.proxies = urllib.request.getproxies()

    def headers(self):
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {config.credential}" if config.credential else ""
        }

    def _map_exception(self, e):
        import requests.exceptions as req_exc
        if isinstance(e, req_exc.ProxyError):
            return "proxy_error"
        if isinstance(e, req_exc.SSLError):
            return "tls_error"
        if isinstance(e, (req_exc.ConnectTimeout, req_exc.ReadTimeout, req_exc.Timeout)):
            return "timeout"
        if isinstance(e, req_exc.ConnectionError):
            e_str = str(e).lower()
            if "name or service not known" in e_str or "getaddrinfo" in e_str or "resolve" in e_str:
                return "dns_error"
            if "connection refused" in e_str:
                return "conn_refused"
            if "connection reset" in e_str:
                return "conn_reset"
            if "unreachable" in e_str:
                return "net_unreachable"
            return "conn_error"
        return "net_error"

    def _map_status_code(self, status_code):
        if status_code in [401, 403]:
            return "revoked"
        if status_code == 404:
            return "http_404"
        if status_code == 429:
            return "http_429"
        if status_code >= 500:
            return f"http_{status_code}"
        if status_code == 200:
            return "ok"
        return f"http_{status_code}"

    def check_health(self):
        try:
            url = f"{config.server_url}/api/health"
            res = self.session.get(url, timeout=10)
            if res.status_code >= 500:
                return f"http_{res.status_code}"
            return "ok"
        except Exception as e:
            return self._map_exception(e)

    def enroll(self, token):
        try:
            url = f"{config.server_url}/api/activity/agent/enroll"
            res = self.session.post(url, json={
                "token": token,
                "deviceId": config.device_id,
                "deviceName": config.device_name
            }, timeout=30)
            if res.status_code == 200:
                data = res.json()
                if data.get("success"):
                    config.credential = data["data"]["credential"]
                    config.employee_id = data["data"]["employeeId"]
                    config.save()
                    return True, data["data"]
            return False, res.json().get("error", f"HTTP {res.status_code}")
        except Exception as e:
            return False, str(e)

    def heartbeat(self, os_idle_seconds=0):
        if not config.credential:
            return "unauthorized"
        try:
            url = f"{config.server_url}/api/activity/agent/heartbeat"
            res = self.session.post(url, headers=self.headers(), json={
                "agentVersion": AGENT_VERSION,
                "osIdleSeconds": os_idle_seconds
            }, timeout=30)
            return self._map_status_code(res.status_code)
        except Exception as e:
            health = self.check_health()
            if health.startswith("http_"):
                return health
            return self._map_exception(e)

    def sync_events(self):
        if not config.credential:
            return "unauthorized"
        batch = storage.get_batch(50)
        if not batch:
            return "ok"
        
        try:
            url = f"{config.server_url}/api/activity/agent/events"
            res = self.session.post(url, headers=self.headers(), json={
                "events": batch
            }, timeout=30)
            
            if res.status_code == 200 and res.json().get("success"):
                storage.remove_batch(len(batch))
                return "ok"
            return self._map_status_code(res.status_code)
        except Exception as e:
            return self._map_exception(e)

api = ApiClient()
