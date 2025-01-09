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
