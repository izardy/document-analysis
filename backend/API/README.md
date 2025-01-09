### Install Ollama
- Linux
```
curl -fsSL https://ollama.com/install.sh | sh
```
- MacOS
```
https://ollama.com/download/mac
```
- Windows
```
https://ollama.com/download/mac](https://ollama.com/download/windows
```
### Ollama Command (Terminal)
- Run Model in Ollama (example model llama3.2)
```
ollama run llama3.2
```
- List Models in Ollama
```
ollama list
```
- Exit Ollama Session
```
/bye
```
- Clear session context
```
/clear
```
### Ollama API
- Basic "curl" 
```
curl http://localhost:11434/api/generate -d '{
    "model": "llama3.2",
    "prompt": "Why is the sky blue?"
}'
```
> This will produce output in multiples lines of json 

- Concatenate "curl" via python script
```
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
```
```data["response"]```
> This gets the value associated with the "response" key from the data dictionary

```end=""```
> By default, print() adds a newline character ( \n) at the end of each print statement. It removes this default newline, making the next print continue on the same line. Without this, each character would print on a new line

```flush=True:```
> By default, Python buffers the output (stores it temporarily) before actually displaying it and forces Python to immediately display the output .This is particularly important for streaming responses where you want to see the text appear in real-time.
- Concatenate "curl" via JS
```
const fetch = require('node-fetch');

const url = 'http://localhost:11434/api/generate';
const payload = {
    model: 'llama3.2',
    prompt: 'Why is the sky blue?'
};

async function generateResponse() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Handle streaming response
            const reader = response.body;
            for await (const chunk of reader) {
                const lines = chunk.toString().split('\n');
                
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            if (data.response) {
                                process.stdout.write(data.response);
                            }
                        } catch (error) {
                            continue;
                        }
                    }
                }
            }
        } else {
            console.log(`Request failed with status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

generateResponse();

```