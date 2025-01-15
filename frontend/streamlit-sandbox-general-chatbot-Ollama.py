import streamlit as st
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
import json
import os
import subprocess

try:
    result = subprocess.run(["ollama", "list"], text=True, capture_output=True)
    print(result.stdout)  # Prints the output of the command
except Exception as e:
    print(f"Error executing command: {e}")

# export to list
output=result.stdout.split('\n')

models = []

for model in output[1:-1]:
    #remove 8 characters from the beginning of the string
    model=model[:-42].strip()
    models.append(model)

# File to store chat history
HISTORY_FILE = "chat_history.json"

# Initialize Conversation Chain
def init_conversation():
    # Add a selectbox for model selection in the sidebar
    available_models = models
    selected_model = st.sidebar.selectbox(
        "Choose a model",
        available_models,
        index=0,  # Default model
    )

    # Initialize the LLM with selected model
    llm = Ollama(model=f"{selected_model}")
    memory = st.session_state.memory

    # Load existing chat history into memory
    if not memory.chat_memory.messages:
        for message in st.session_state.messages:
            if message["role"] == "user":
                memory.chat_memory.add_user_message(message["content"])
            elif message["role"] == "assistant":
                memory.chat_memory.add_ai_message(message["content"])
    
    return ConversationChain(llm=llm, memory=memory, verbose=True)

# Load chat history from file
def load_chat_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []

# Save chat history to file
def save_chat_history(messages):
    with open(HISTORY_FILE, 'w') as f:
        json.dump(messages, f)

# Create the Streamlit interface
st.title('Sandbox for General Chatbot')

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = load_chat_history()
if 'memory' not in st.session_state:
    st.session_state.memory = ConversationBufferMemory()
if 'conversation' not in st.session_state:
    st.session_state.conversation = init_conversation()
if 'file_processed' not in st.session_state:
    st.session_state.file_processed = False
if 'file_response' not in st.session_state:
    st.session_state.file_response = None

# Add a clear history button
if st.button("Clear Chat History"):
    st.session_state.messages = []
    save_chat_history([])
    # Reinitialize conversation with empty memory
    st.session_state.conversation = init_conversation()
    st.rerun()

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("What would you like to know?"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)

    # Generate response
    try:
        # Get response from conversation chain instead of direct LLM call
        response = st.session_state.conversation.predict(input=prompt)

        # Display assistant response
        with st.chat_message("assistant"):
            st.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        # Save updated chat history
        save_chat_history(st.session_state.messages)
    
    except Exception as e:
        st.error(f"Error communicating with Ollama: {str(e)}")
