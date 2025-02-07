from typing import Dict, Any
from boto3.session import Session
import boto3
import time
import logging
from botocore.exceptions import ClientError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_bedrock_agent_client(region: str = "us-east-1", profile: str | None = None) -> Any:
    session = Session(profile_name=profile) if profile else Session()
    return session.client("bedrock-agent", region_name=region)

def list_bedrock_agents(region: str = "us-east-1", profile: str | None = None, max_retries: int = 5, retry_delay: int = 10) -> None:
    bedrock_agent = get_bedrock_agent_client(region, profile)
    
    attempt = 0
    while attempt < max_retries:
        try:
            attempt += 1
            logger.info(f"Attempting to list agents (attempt {attempt}/{max_retries})")
            
            paginator = bedrock_agent.get_paginator('list_agents')
            response_iterator = paginator.paginate()
                
            agents_found = False
            print("\nAvailable Agents:")
            print("------------------------")
            
            for response in response_iterator:
                if 'agentSummaries' in response and response['agentSummaries']:
                    agents_found = True
                    for agent in response['agentSummaries']:
                        print(f"Agent ID: {agent['agentId']}")
                        print(f"Name: {agent['agentName']}")
                        print(f"Status: {agent['agentStatus']}")
                        print(f"Description: {agent.get('description', 'N/A')}")
                        print(f"Latest Agent Version: {agent.get('latestAgentVersion', 'N/A')}")
                        print(f"Updated At: {agent.get('updatedAt', 'N/A')}")
                        print("------------------------")
            
            if not agents_found:
                print("No agents found")
                print("------------------------")
            
            # If we get here without an exception, break the retry loop
            break
    
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', '')
            error_message = e.response.get('Error', {}).get('Message', str(e))
            
            if error_code == 'validationException' and 'resuming after being auto-paused' in error_message:
                if attempt < max_retries:
                    logger.warning(f"Database is resuming from auto-pause. Waiting {retry_delay} seconds before retry...")
                    time.sleep(retry_delay)
                    continue
                else:
                    logger.error(f"Max retries ({max_retries}) reached while waiting for database to resume")
            
            logger.error(f"Error listing agents: {error_message}")
            break
            
        except Exception as e:
            logger.error(f"Unexpected error listing agents: {str(e)}")
            break

if __name__ == "__main__":
    list_bedrock_agents()
