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
- Concatenate "curl" via python script
```
import requests

# Define the API endpoint and payload
url = "http://localhost:11434/api/generate"
payload = {
    "model": "llama3.2",
    "prompt": "Why is the sky blue?"
}

# Send the request to the Ollama API
response = requests.post(url, json=payload)

# Check if the request was successful
if response.status_code == 200:
    # Get the response text
    response_text = response.json().get("text", "")

    # Concatenate the response with other text
    additional_text = " This is additional text."
    concatenated_output = response_text + additional_text

    # Print the concatenated output
    print(concatenated_output)
else:
    print("Failed to get a response from the API.")

```
```data["response"]```
- This gets the value associated with the "response" key from the data dictionary

```end=""```
- By default, print() adds a newline character ( \n) at the end of each print statement. It removes this default newline, making the next print continue on the same line. Without this, each character would print on a new line

```flush=True:```
- By default, Python buffers the output (stores it temporarily) before actually displaying it and forces Python to immediately display the output .This is particularly important for streaming responses where you want to see the text appear in real-time.