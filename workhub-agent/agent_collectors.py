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
            raw_name = process.name().replace(".exe", "").lower()
            
            # Map common names to human-readable forms
            app_map = {
                "chrome": "Google Chrome",
                "msedge": "Microsoft Edge",
                "firefox": "Mozilla Firefox",
                "brave": "Brave Browser",
                "code": "VS Code",
                "devenv": "Visual Studio",
                "excel": "Microsoft Excel",
                "winword": "Microsoft Word",
                "powerpnt": "Microsoft PowerPoint",
                "explorer": "File Explorer",
                "teams": "Microsoft Teams",
                "zoom": "Zoom",
                "notepad": "Notepad"
            }
            app_name = app_map.get(raw_name, process.name().replace(".exe", ""))
            
            # Privacy safe: drop window title for browsers since the extension tracks URLs safely
            if raw_name in ["chrome", "msedge", "firefox", "brave"]:
                title = None
                
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass
        
    return app_name, title

def current_iso():
    return datetime.now(timezone.utc).isoformat()
