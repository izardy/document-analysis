# Bedrock Agent API

A FastAPI-based REST API wrapper for AWS Bedrock Agents.

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Ensure AWS credentials are properly configured with access to Bedrock services.

## Running the API Server

Start the API server:

```bash
python api.py
```

The server will run on http://localhost:8000

## API Endpoints

### POST /invoke

Invoke a Bedrock agent with the provided input.

**Request Body:**

```json
{
  "input": {
    "campaign_name": "2024 Has Been Amazing, Thanks to You!",
    "target_audience": "Be U App Users",
    "platform": "Email",
    "caption": "Secure. Ethical. Rewarding. Your future starts here.",
    "visual_descriptions": "A family reviewing financial documents together, sitting at home with a warm and professional atmosphere.",
    "disclaimers": "Offer applicable for new customers only, subject to terms and conditions.",
    "key_opinion_leader": "Be U Team",
    "involvement": "Email Campaign",
    "classification": "Year-End Campaign" //(New Product/Service | Existing Product/Service | Non-Product/Service Related | Campaign)
  },
  "agent_id": "OWTCLJJVSN", // Optional, defaults to OWTCLJJVSN
  "max_retries": 5, // Optional, defaults to 5
  "retry_delay": 10 // Optional, defaults to 10 seconds
}
```

**Response:**

```json
{
  "response": "Agent's response text",
  "trace_steps": [
    {
      "stepName": "Step name",
      "status": "Step status",
      "timestamp": "Timestamp"
    }
  ],
  "error": null // Error message if something went wrong
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy"
}
```

## Example Usage

Using curl:

```bash
curl -X POST http://localhost:8000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "campaign_name": "2024 Has Been Amazing, Thanks to You!",
      "target_audience": "Be U App Users",
      "platform": "Email",
      "caption": "Secure. Ethical. Rewarding. Your future starts here.",
      "visual_descriptions": "A family reviewing financial documents together",
      "disclaimers": "Offer applicable for new customers only",
      "key_opinion_leader": "Be U Team",
      "involvement": "Email Campaign",
      "classification": "Year-End Campaign"
    }
  }'
```

Using Python requests:

```python
import requests
import json

response = requests.post(
    "http://localhost:8000/invoke",
    json={
        "input": {
            "campaign_name": "2024 Has Been Amazing, Thanks to You!",
            "target_audience": "Be U App Users",
            "platform": "Email",
            "caption": "Secure. Ethical. Rewarding. Your future starts here.",
            "visual_descriptions": "A family reviewing financial documents together",
            "disclaimers": "Offer applicable for new customers only",
            "key_opinion_leader": "Be U Team",
            "involvement": "Email Campaign",
            "classification": "Year-End Campaign"
        }
    }
)
print(json.dumps(response.json(), indent=2))
```

## API Documentation

Interactive API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
