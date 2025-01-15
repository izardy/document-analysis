import streamlit as st
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
import json
import os

# File to store chat history
HISTORY_FILE = "chat_history.json"

# Initialize Ollama with conversation memory
def init_conversation():
    llm = Ollama(model="llama3.2")
    memory = ConversationBufferMemory()
    
    # If there's existing chat history, load it into memory
    if st.session_state.messages:
        for message in st.session_state.messages:
            if message["role"] == "user":
                memory.chat_memory.add_user_message(message["content"])
            elif message["role"] == "assistant":
                memory.chat_memory.add_ai_message(message["content"])
                
    return ConversationChain(
        llm=llm,
        memory=memory,
        verbose=True
    )

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

# Initialize chat history in session state if it doesn't exist
if 'messages' not in st.session_state:
    st.session_state.messages = load_chat_history()

# Initialize conversation chain in session state
if 'conversation' not in st.session_state:
    st.session_state.conversation = init_conversation()

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
