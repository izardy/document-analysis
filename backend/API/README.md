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
- curl
```
curl http://localhost:11434/api/generate -d '{
    "model": "llama3.2",
    "prompt": "Why is the sky blue?"
}'

```
