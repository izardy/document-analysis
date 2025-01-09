# just a simple chatbot enviroment with no integration of pdf/img upload and vectorstore

import streamlit as st
from langchain_community.llms import Ollama

# Initialize Ollama
def init_ollama():
    return Ollama(model="llama3.2")  # or whatever model you have installed

# Create the Streamlit interface
st.title('Sandbox for General Chatbot')

# Initialize chat history in session state if it doesn't exist
if 'messages' not in st.session_state:
    st.session_state.messages = []

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
        llm = init_ollama()
        response = llm(prompt)

        # Display assistant response
        with st.chat_message("assistant"):
            st.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
    
    except Exception as e:
        st.error(f"Error communicating with Ollama: {str(e)}")
