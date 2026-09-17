import ctypes
from ctypes import wintypes
import win32process
import win32gui
import psutil
import time
from datetime import datetime, timezone

user32 = ctypes.windll.user32

class LASTINPUTINFO(ctypes.Structure):
    _fields_ = [
        ("cbSize", wintypes.UINT),
        ("dwTime", wintypes.DWORD)
    ]

def get_idle_time_seconds():
    lastInputInfo = LASTINPUTINFO()
    lastInputInfo.cbSize = ctypes.sizeof(lastInputInfo)
    if user32.GetLastInputInfo(ctypes.byref(lastInputInfo)):
        millis = ctypes.windll.kernel32.GetTickCount() - lastInputInfo.dwTime
        return millis / 1000.0
    return 0

def get_active_window_info():
    hwnd = win32gui.GetForegroundWindow()
    if not hwnd:
        return None, None
    
    length = win32gui.GetWindowTextLength(hwnd)
    title = win32gui.GetWindowText(hwnd) if length > 0 else "Unknown Window"
    
    _, pid = win32process.GetWindowThreadProcessId(hwnd)
    
    app_name = "Unknown Application"
    try:
        if pid > 0:
            process = psutil.Process(pid)
            app_name = process.name().replace(".exe", "")
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass
        
    return app_name, title

def current_iso():
    return datetime.now(timezone.utc).isoformat()
