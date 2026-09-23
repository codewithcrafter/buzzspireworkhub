import time
import threading
import sys
import os
import tkinter as tk
from tkinter import messagebox
from datetime import datetime, timezone

import win32event
import win32api
import winerror
import winreg
import pystray
from PIL import Image, ImageDraw

from agent_config import config
from agent_storage import storage
from agent_api import api
from agent_collectors import get_active_window_info, get_idle_time_seconds, current_iso

def enable_startup():
    if getattr(sys, 'frozen', False):
        exe_path = sys.executable
        try:
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_SET_VALUE)
            winreg.SetValueEx(key, "BuzzSpireWorkHubAgent", 0, winreg.REG_SZ, f'"{exe_path}"')
            winreg.CloseKey(key)
        except Exception:
            pass

def disable_startup():
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_SET_VALUE)
        winreg.DeleteValue(key, "BuzzSpireWorkHubAgent")
        winreg.CloseKey(key)
    except FileNotFoundError:
        pass
    except Exception:
        pass

def is_startup_enabled():
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_READ)
        val, _ = winreg.QueryValueEx(key, "BuzzSpireWorkHubAgent")
        winreg.CloseKey(key)
        return True
    except FileNotFoundError:
        return False
    except Exception:
        return False

def create_tray_image():
    image = Image.new('RGB', (64, 64), (255, 255, 255))
    d = ImageDraw.Draw(image)
    d.rectangle((16, 16, 48, 48), fill=(0, 100, 250))
    return image

class AgentDaemon:
    def __init__(self):
        self.running = False
        self.current_app = None
        self.current_title = None
        self.app_start_time = None
        
        self.is_idle = False
        self.idle_start_time = None
        
        self.status = "ok"

    def start(self):
        self.running = True
        
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
                
                if idle_sec >= config.idle_threshold_seconds and not self.is_idle:
                    self.is_idle = True
                    self.idle_start_time = datetime.now(timezone.utc)
                    self.record_app_event()
                    self.current_app = None
                    
                elif idle_sec < config.idle_threshold_seconds and self.is_idle:
                    self.is_idle = False
                    self.record_idle_event()
                    self.idle_start_time = None

                if not self.is_idle:
                    app_name, title = get_active_window_info()
                    if app_name:
                        if app_name != self.current_app or title != self.current_title:
                            self.record_app_event()
                            self.current_app = app_name
                            self.current_title = title
                            self.app_start_time = datetime.now(timezone.utc)
                            
            except Exception as e:
                print(f"Monitor error: {e}")
                
            time.sleep(1)

    def heartbeat_loop(self):
        while self.running:
            idle_sec = get_idle_time_seconds()
            res = api.heartbeat(int(idle_sec))
            if res:
                self.status = res
            time.sleep(config.heartbeat_interval)

    def sync_loop(self):
        while self.running:
            res = api.sync_events()
            if res:
                self.status = res
            time.sleep(config.event_batch_interval)

class AgentGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("BuzzSpire WorkHub Agent")
        self.root.geometry("350x260")
        self.root.resizable(False, False)
        
        self.root.protocol("WM_DELETE_WINDOW", self.minimize_to_tray)
        
        self.daemon = None
        self.icon = None
        self.startup_var = tk.IntVar(value=1 if is_startup_enabled() else 0)
        
        self.build_ui()
        
        if config.credential:
            self.start_daemon()
            
        self.root.after(1000, self.poll_daemon_status)

    def build_ui(self):
        for widget in self.root.winfo_children():
            widget.destroy()

        if config.credential:
            self.build_connected_ui()
        else:
            self.build_pairing_ui()

    def build_pairing_ui(self):
        tk.Label(self.root, text="BUZZSPIRE WORKHUB", font=("Segoe UI", 12, "bold")).pack(pady=(20, 5))
        tk.Label(self.root, text="Activity Agent", font=("Segoe UI", 10)).pack()
        
        tk.Label(self.root, text="Pair your computer", font=("Segoe UI", 10)).pack(pady=(15, 5))
        
        frame = tk.Frame(self.root)
        frame.pack(pady=5)
        
        tk.Label(frame, text="Pairing Code").pack(side=tk.LEFT, padx=5)
        
        self.code_var = tk.StringVar()
        entry = tk.Entry(frame, textvariable=self.code_var, width=10, font=("Segoe UI", 10), justify="center")
        entry.pack(side=tk.LEFT)
        
        tk.Button(self.root, text="CONNECT", command=self.handle_connect, width=15).pack(pady=10)
        
        tk.Label(self.root, text="Status:\n● Not Connected", fg="gray", justify=tk.CENTER).pack()

    def build_connected_ui(self):
        tk.Label(self.root, text="✓ Connected", fg="green", font=("Segoe UI", 12, "bold")).pack(pady=(15, 10))
        
        tk.Label(self.root, text=f"Employee: {config.employee_id}").pack(pady=2)
        tk.Label(self.root, text=f"Device: {config.device_name}").pack(pady=2)
        
        self.status_label = tk.Label(self.root, text="● Monitoring Active", fg="blue")
        self.status_label.pack(pady=(15, 5))
        
        if getattr(sys, 'frozen', False):
            chk = tk.Checkbutton(self.root, text="Run on Windows Startup", variable=self.startup_var, command=self.toggle_startup)
            chk.pack(pady=(10, 0))

    def toggle_startup(self):
        if self.startup_var.get() == 1:
            enable_startup()
        else:
            disable_startup()

    def handle_connect(self):
        code = self.code_var.get().strip()
        if not code.isdigit() or len(code) != 6:
            messagebox.showerror("Error", "Pairing code must be exactly 6 digits.")
            return
            
        success, data = api.enroll(code)
        if success:
            if getattr(sys, 'frozen', False):
                enable_startup()
                self.startup_var.set(1)
            self.build_ui()
            self.start_daemon()
            messagebox.showinfo("Success", "Agent is now connected to WorkHub.")
        else:
            expected_errors = [
                "Invalid pairing code.",
                "This pairing code has expired.",
                "This pairing code has already been used."
            ]
            if data in expected_errors:
                messagebox.showerror("Error", data)
            else:
                messagebox.showerror("Error", "Device pairing was rejected by WorkHub.")

    def start_daemon(self):
        if not self.daemon:
            self.daemon = AgentDaemon()
            threading.Thread(target=self.daemon.start, daemon=True).start()

    def poll_daemon_status(self):
        if self.daemon and self.daemon.running:
            if self.daemon.status == "revoked":
                self.daemon.running = False
                self.daemon = None
                config.credential = None
                config.save()
                messagebox.showerror("Auth Error", "Device authorization required.")
                if self.icon:
                    self.icon.stop()
                    self.icon = None
                    self.root.deiconify()
                self.build_ui()
            elif self.daemon.status == "unreachable":
                if hasattr(self, 'status_label'):
                    self.status_label.config(text="WorkHub server unavailable", fg="red")
            elif self.daemon.status == "ok":
                if hasattr(self, 'status_label'):
                    self.status_label.config(text="● Monitoring Active", fg="blue")
        
        self.root.after(1000, self.poll_daemon_status)

    def minimize_to_tray(self):
        self.root.withdraw()
        if not self.icon:
            menu = pystray.Menu(
                pystray.MenuItem("Show", self.show_window, default=True),
                pystray.MenuItem("Exit Agent", self.exit_agent)
            )
            self.icon = pystray.Icon("BuzzSpireWorkHub", create_tray_image(), "BuzzSpire WorkHub Agent", menu)
            threading.Thread(target=self.icon.run, daemon=True).start()

    def show_window(self, icon, item):
        if self.icon:
            self.icon.stop()
            self.icon = None
        self.root.after(0, self.root.deiconify)

    def exit_agent(self, icon, item):
        if self.icon:
            self.icon.stop()
        if self.daemon:
            self.daemon.running = False
        self.root.after(0, self.root.destroy)


if __name__ == "__main__":
    mutex_name = "Global\\BuzzSpireWorkHubAgent_Mutex"
    mutex = win32event.CreateMutex(None, False, mutex_name)
    if win32api.GetLastError() == winerror.ERROR_ALREADY_EXISTS:
        # Agent already running
        sys.exit(0)
        
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "enroll":
            if len(sys.argv) < 3:
                print("Usage: python agent_main.py enroll <TOKEN>")
                sys.exit(1)
            token = sys.argv[2]
            success, msg = api.enroll(token)
            if success:
                print("Enrolled successfully")
            else:
                print(msg)
                sys.exit(1)
            sys.exit(0)
            
        elif command == "pair":
            if len(sys.argv) < 3:
                print("Usage: python agent_main.py pair <6_DIGIT_CODE>")
                sys.exit(1)
            code = sys.argv[2]
            if not code.isdigit() or len(code) != 6:
                print("Pairing failed: Pairing code must be exactly 6 digits.")
                sys.exit(1)
                
            success, data = api.enroll(code)
            if success:
                emp_name = data.get("employeeName", "Unknown")
                dev_name = data.get("deviceName", config.device_name)
                print("-" * 32)
                print("BuzzSpire WorkHub Agent\n")
                print("Pairing successful!\n")
                print(f"Employee: {emp_name}")
                print(f"Device: {dev_name}\n")
                print("Agent is now connected to WorkHub.")
                print("-" * 32)
            else:
                expected_errors = [
                    "Invalid pairing code.",
                    "This pairing code has expired.",
                    "This pairing code has already been used."
                ]
                if data in expected_errors:
                    print(f"Pairing failed: {data}")
                else:
                    print("Pairing failed: Device pairing was rejected by WorkHub.")
            sys.exit(0 if success else 1)
    
    else:
        root = tk.Tk()
        app = AgentGUI(root)
        root.mainloop()
        sys.exit(0)
