import requests
import json

url = "http://localhost:11434/api/generate"
payload = {
    "model": "llama3.2",
    "prompt": "Why is the sky blue?"
}

response = requests.post(url, json=payload)
if response.status_code == 200:
    # Handle streaming response
    for line in response.text.strip().split('\n'):
        try:
            data = json.loads(line)
            if "response" in data:
                print(data["response"], end="", flush=True)
        except json.JSONDecodeError:
            continue
else:
    print(f"Request failed with status code: {response.status_code}")
