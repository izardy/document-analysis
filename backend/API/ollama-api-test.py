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
