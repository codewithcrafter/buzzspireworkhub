# BuzzSpire WorkHub Windows Activity Agent (Phase A)

## Transparency & Privacy
This is a transparent work activity monitoring agent for company-managed devices.
It collects **work-activity metadata only**:
- Active application name (e.g., `Code`, `chrome`)
- Active window title
- Duration of activity
- System idle states

**It DOES NOT collect:**
- Keystrokes
- Passwords
- Clipboard contents
- Screen recordings
- Webcam/Microphone feeds
- Document contents

## Requirements
- Windows OS
- Python 3.11+
- Requirements: `pip install -r requirements.txt`

## Enrollment
Ask your WorkHub Administrator for an enrollment token.
```bash
python agent_main.py enroll <YOUR_TOKEN>
```

## Running the Agent
```bash
python agent_main.py
```
*(In production, this would be wrapped as a PyInstaller executable or standard Windows autostart application)*.
