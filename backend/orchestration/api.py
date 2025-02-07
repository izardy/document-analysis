from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import asyncio
from main import invoke_bedrock_agent

app = FastAPI(
    title="Bedrock Agent API",
    description="API for interacting with AWS Bedrock Agents",
    version="1.0.0"
)

class CampaignInput(BaseModel):
    campaign_name: str
    target_audience: str
    platform: str
    caption: str
    visual_descriptions: str
    disclaimers: str
    key_opinion_leader: Optional[str] = None
    involvement: Optional[str] = None
    classification: Optional[str] = None

class AgentRequest(BaseModel):
    input: CampaignInput
    agent_id: str = "OWTCLJJVSN"  # Default agent ID
    max_retries: int = 5
    retry_delay: int = 10

class AgentResponse(BaseModel):
    response: Optional[str]
    trace_steps: Optional[list]
    error: Optional[str]

@app.post("/invoke")
async def invoke_agent(request: AgentRequest):
    """
    Invoke a Bedrock agent with the provided input text.
    
    Parameters:
    - input_text: The text input for the agent
    - agent_id: The ID of the Bedrock agent (optional, defaults to OWTCLJJVSN)
    - max_retries: Maximum number of retry attempts (optional, defaults to 5)
    - retry_delay: Delay between retries in seconds (optional, defaults to 10)
    
    Returns:
    - AgentResponse containing the agent's response and trace steps
    """
    async def stream_response():
        try:
            # Convert campaign input to JSON string
            input_json = json.dumps(request.input.model_dump())
            
            # Create generator for streaming response
            for event in invoke_bedrock_agent(
                agent_id=request.agent_id,
                input_text=input_json,
                max_retries=request.max_retries,
                retry_delay=request.retry_delay,
                stream=True  # Enable streaming
            ):
                if isinstance(event, dict):
                    yield json.dumps(event) + "\n"
                else:
                    yield str(event) + "\n"
                await asyncio.sleep(0.1)  # Small delay to prevent overwhelming the client
                
        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"
    
    return StreamingResponse(
        stream_response(),
        media_type="application/x-ndjson"
    )

@app.get("/health")
async def health_check():
    """
    Simple health check endpoint
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
