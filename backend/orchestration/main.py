import boto3
import json
import time
import logging
from botocore.exceptions import ClientError
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Changed to DEBUG level
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def invoke_bedrock_agent(agent_id: str, input_text: str, max_retries: int = 5, retry_delay: int = 10, stream: bool = False):
    # Initialize Bedrock Agent Runtime client
    bedrock_agent = boto3.client(
        service_name='bedrock-agent-runtime',
        region_name='us-east-1'
    )
    
    attempt = 0
    while attempt < max_retries:
        try:
            attempt += 1
            debug_msg = f"Attempting to invoke agent (attempt {attempt}/{max_retries})"
            logger.info(debug_msg)
            if stream:
                yield {"debug": debug_msg}
            
            # Invoke the agent
            response = bedrock_agent.invoke_agent(
                agentId=agent_id,
                agentAliasId='VHZKWGOD3I',
                sessionId='test-session-1',  # You can make this dynamic
                inputText=input_text,
                enableTrace=True  # Enable tracing explicitly
            )
            
            # Process the event stream response
            response_text = ""
            trace_steps = []
            
            debug_msg = "Processing response stream..."
            logger.debug(debug_msg)
            if stream:
                yield {"debug": debug_msg}
            for event in response['completion']:
                debug_msg = f"Event type: {list(event.keys())}"
                logger.debug(debug_msg)
                if stream:
                    yield {"debug": debug_msg}
                
                if 'trace' in event:
                    debug_msg = f"Trace event: {json.dumps(event['trace'], indent=2)}"
                    logger.debug(debug_msg)
                    if stream:
                        yield {"debug": debug_msg}
                    trace = event['trace']
                    if 'traces' in trace:
                        for step in trace['traces']:
                            trace_steps.append({
                                'stepName': step.get('stepName', 'Unknown Step'),
                                'status': step.get('status', 'Unknown Status'),
                                'timestamp': step.get('timestamp', None)
                            })
                elif event.get('chunk'):
                    chunk_text = event['chunk']['bytes'].decode('utf-8')
                    debug_msg = f"Response chunk: {chunk_text}"
                    logger.debug(debug_msg)
                    if stream:
                        yield {"debug": debug_msg}
                    response_text += chunk_text
                else:
                    debug_msg = f"Unknown event type: {event}"
                    logger.debug(debug_msg)
                    if stream:
                        yield {"debug": debug_msg}
            
            if response_text or trace_steps:
                debug_msg = "Successfully received response from agent"
                logger.info(debug_msg)
                if stream:
                    yield {"debug": debug_msg}
                
                result = {
                    'response': response_text,
                    'trace_steps': trace_steps
                }
            else:
                debug_msg = "Received empty response from agent"
                logger.warning(debug_msg)
                if stream:
                    yield {"debug": debug_msg}
                    yield {"error": "Empty response from agent"}
                return None
                
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', '')
            error_message = e.response.get('Error', {}).get('Message', str(e))
            
            if error_code == 'validationException' and 'resuming after being auto-paused' in error_message:
                if attempt < max_retries:
                    debug_msg = f"Database is resuming from auto-pause. Waiting {retry_delay} seconds before retry..."
                    logger.warning(debug_msg)
                    if stream:
                        yield {"debug": debug_msg}
                    time.sleep(retry_delay)
                    continue
                else:
                    debug_msg = f"Max retries ({max_retries}) reached while waiting for database to resume"
                    logger.error(debug_msg)
                    if stream:
                        yield {"debug": debug_msg}
                        yield {"error": "Max retries reached"}
                    return None
            
            debug_msg = f"Error invoking agent: {error_message}"
            logger.error(debug_msg)
            if stream:
                yield {"debug": debug_msg}
                yield {"error": error_message}
            return None
            
        except Exception as e:
            debug_msg = f"Unexpected error invoking agent: {str(e)}"
            logger.error(debug_msg)
            if stream:
                yield {"debug": debug_msg}
                yield {"error": str(e)}
            return None

# Example usage
if __name__ == "__main__":
    # Replace with your actual agent ID
    agent_id = "OWTCLJJVSN"
    
    # Example input
    input_text = json.dumps({
        "Campaign": "2024 Has Been Amazing, Thanks to You!",
        "Platform": "Email",
        "Content": """Dear Be U Besties,

As 2024 draws to a close, we hope this year has been kind to you and filled with many wonderful moments. At Be U, we're so grateful for your continued support and for being part of our Be U community.

As we look forward to an exciting year ahead, we wanted to remind you about four of our amazing campaigns that will be wrapping up on 31st December 2024. There's still time to join, so don't miss out!

Here's a quick and friendly rundown: [this can be out under a box, all four campaign be included]

🌟 Referral Campaign

Share the love! Introduce your friends to Be U and earn RM10 for every friend who successfully opens a Be U Qard Savings Account-i using your referral code. The more friends you refer, the more cash rewards you'll collect—it's that simple!

💰 Be U Term Deposit-i TDT Extra Campaign

Looking to grow your savings? Start with as little as RM500 and enjoy an impressive profit rate of up to 4.00% per annum for a tenure of 12 months. It's a smart way to make your money work for you.

🎉 Be U Al-Awfar The Ten Treat Campaign

Don't miss out on this sweet deal—be one of the first 4,000 customers to successfully open a Be U Al-Awfar account with a minimum deposit of RM100, and we'll reward you with RM10.

🏆 Be U Al-Awfar Special Campaign

Triple your chances to win incredible prizes from a total prize pool worth RM18 million! Successfully open a Be U Al-Awfar account and maintain an average monthly balance of RM500 during the campaign period.

---

Each campaign is designed with you in mind—to help you earn, grow, and win big.

Thank you once again for being part of our journey this year. We're so excited to bring you more amazing campaigns and rewards in 2025. Wishing you a happy and fulfilling end to 2024, and we can't wait to see what the new year brings for all of us!

With warm wishes,
The Be U Team

P.S. Want to know more? Visit www.getbeu.com to explore all the details""",
        "Caption": "Secure. Ethical. Rewarding. Your future starts here.",
        "Visual": "A family reviewing financial documents together, sitting at home with a warm and professional atmosphere.",
        "Disclaimer": "Offer applicable for new customers only, subject to terms and conditions. Benefits apply to contributions made within the first 12 months. Please ensure you review our Terms and Conditions on the official website. For inquiries, contact us directly via this email or visit our office. Halal certification details are available upon request."
    })
    
    # Invoke the agent with retry logic
    for event in invoke_bedrock_agent(agent_id, input_text, stream=True):
        if isinstance(event, dict):
            if "debug" in event:
                print(f"DEBUG: {event['debug']}")
            elif "error" in event:
                print(f"ERROR: {event['error']}")
            elif "response" in event:
                print("\nFinal Response:")
                print(event['response'])
                if event.get('trace_steps'):
                    print("\nAgent Execution Steps:")
                    for step in event['trace_steps']:
                        print(f"Step: {step['stepName']}")
                        print(f"Status: {step['status']}")
                        if step['timestamp']:
                            print(f"Time: {step['timestamp']}")
                        print("------------------------")
