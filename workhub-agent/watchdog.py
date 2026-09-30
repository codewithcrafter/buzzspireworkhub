import time
import subprocess
import json
import os
import win32api
import win32process
import win32con
import win32event
import psutil
import sys
import winreg

if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CONFIG_FILE = os.path.join(BASE_DIR, "agent_config.json")
# For testing locally without moving EXEs, if TARGET_EXE is in dist:
if not getattr(sys, 'frozen', False) and os.path.exists(os.path.join(BASE_DIR, "dist", "BuzzSpireWorkHubAgent.exe")):
    TARGET_EXE = os.path.join(BASE_DIR, "dist", "BuzzSpireWorkHubAgent.exe")
else:
    TARGET_EXE = os.path.join(BASE_DIR, "BuzzSpireWorkHubAgent.exe")


def enable_startup():
    if getattr(sys, 'frozen', False):
        exe_path = sys.executable
        try:
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_SET_VALUE)
            # Register the watchdog to start on boot
            winreg.SetValueEx(key, "BuzzSpireWorkHubWatchdog", 0, winreg.REG_SZ, f'"{exe_path}"')
            winreg.CloseKey(key)
        except Exception as e:
            print(f"Failed to enable startup: {e}")

def has_credential():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                data = json.load(f)
                return data.get("credential") is not None
        except:
            return False
    return False

def find_running_agent_pid():
    target = os.path.basename(TARGET_EXE).lower()
    for p in psutil.process_iter(['name', 'pid']):
        try:
            if p.info['name'] and p.info['name'].lower() == target:
                return p.info['pid']
        except:
            pass
    return None

def run_watchdog():
    print(f"Starting watchdog for {TARGET_EXE}")
    enable_startup()
    
    while True:
        pid = find_running_agent_pid()
        if pid:
            print(f"Agent is already running (PID: {pid}). Supervising...")
            try:
                h_process = win32api.OpenProcess(win32con.PROCESS_QUERY_INFORMATION | win32con.SYNCHRONIZE, False, pid)
                win32event.WaitForSingleObject(h_process, win32event.INFINITE)
                exit_code = win32process.GetExitCodeProcess(h_process)
                win32api.CloseHandle(h_process)
                
                print(f"Agent exited with code {exit_code}")
                
                if exit_code == 0:
                    print("Clean exit detected. Not restarting automatically.")
                    print("Exiting watchdog to prevent restart loop after manual exit.")
                    sys.exit(0)
                else:
                    print(f"Unexpected exit code {exit_code}. Restarting in 3 seconds...")
                    time.sleep(3)
                    
            except Exception as e:
                print(f"Error supervising existing process: {e}")
                time.sleep(5)
                
        else:
            print("Agent not running. Starting it...")
            try:
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = 1
                subprocess.Popen([TARGET_EXE], startupinfo=startupinfo)
                time.sleep(2)
            except Exception as e:
                print(f"Failed to start agent: {e}")
                time.sleep(5)

import winerror

if __name__ == "__main__":
    mutex_name = "Global\\BuzzSpireWorkHubWatchdog_Mutex"
    mutex = win32event.CreateMutex(None, False, mutex_name)
    if win32api.GetLastError() == winerror.ERROR_ALREADY_EXISTS:
        sys.exit(0)
        
    run_watchdog()
