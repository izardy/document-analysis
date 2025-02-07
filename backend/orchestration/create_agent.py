import boto3
import json
import time

def create_temp_agent():
    # Initialize Bedrock Agent client
    bedrock_agent = boto3.client(
        service_name='bedrock-agent',
        region_name='us-east-1'
    )
    
    try:
        # Create an agent
        response = bedrock_agent.create_agent(
            agentName='TempTestAgent',
            description='Temporary agent for testing purposes',
            instruction='You are a helpful assistant that helps analyze campaign content.',
            foundationModel='anthropic.claude-3-haiku-20240307-v1:0',
        )
        
        agent_id = response['agent']['agentId']
        print(f"\nAgent created successfully!")
        print(f"Agent ID: {agent_id}")
        print(f"Status: {response['agent']['status']}")
        
        # Wait for the agent to be ready
        print("\nWaiting for agent to be ready...")
        while True:
            status_response = bedrock_agent.get_agent(agentId=agent_id)
            status = status_response['agent']['status']
            print(f"Current status: {status}")
            
            if status == 'READY':
                print("\nAgent is ready!")
                break
            elif status in ['FAILED', 'ERROR']:
                print("\nAgent creation failed!")
                break
                
            time.sleep(10)  # Wait 10 seconds before checking again
            
        return agent_id
            
    except Exception as e:
        print(f"Error creating agent: {str(e)}")
        return None

if __name__ == "__main__":
    create_temp_agent()
