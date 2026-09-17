import json
import os

QUEUE_FILE = "agent_queue.jsonl"
MAX_QUEUE_SIZE = 5000

class Storage:
    def enqueue(self, event):
        # Prevent huge queue
        self._trim_queue()
        with open(QUEUE_FILE, "a") as f:
            f.write(json.dumps(event) + "\n")

    def get_batch(self, batch_size=50):
        if not os.path.exists(QUEUE_FILE):
            return []
        events = []
        try:
            with open(QUEUE_FILE, "r") as f:
                lines = f.readlines()
            for line in lines[:batch_size]:
                if line.strip():
                    events.append(json.loads(line))
            return events
        except:
            return []

    def remove_batch(self, batch_size=50):
        if not os.path.exists(QUEUE_FILE):
            return
        try:
            with open(QUEUE_FILE, "r") as f:
                lines = f.readlines()
            with open(QUEUE_FILE, "w") as f:
                f.writelines(lines[batch_size:])
        except:
            pass

    def _trim_queue(self):
        if not os.path.exists(QUEUE_FILE):
            return
        try:
            with open(QUEUE_FILE, "r") as f:
                lines = f.readlines()
            if len(lines) > MAX_QUEUE_SIZE:
                with open(QUEUE_FILE, "w") as f:
                    # Keep latest (discard oldest)
                    f.writelines(lines[-MAX_QUEUE_SIZE:])
        except:
            pass

storage = Storage()
