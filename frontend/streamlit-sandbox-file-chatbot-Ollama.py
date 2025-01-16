import streamlit as st
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from PIL import Image
import PyPDF2
import base64
import io
import os
import json


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

# Extract text from PDF
def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

# Describe image
def describe_image(image_file):
    try:
        image = Image.open(image_file)
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        prompt = ("Provide a detailed description of this image, including: "
                  "main subjects, colors, composition, lighting, setting, "
                  "and any notable details or activities shown.")
        
        llm = st.session_state.conversation.llm
        description = llm(prompt, images=[img_str])
        return description
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")

# Initialize Streamlit app
st.title("Sandbox for Digital Document Content Analysis")

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

# Clear chat history button
if st.button("Clear Chat History"):
    st.session_state.messages = []
    st.session_state.memory.chat_memory.clear()
    st.session_state.file_processed = False
    st.session_state.file_response = None
    save_chat_history([])
    st.rerun()

# File uploader
uploaded_file = st.file_uploader("Upload a PDF or Image file", type=['pdf', 'png', 'jpg', 'jpeg'])

# Process the file only once
if uploaded_file is not None and not st.session_state.file_processed:
    try:
        file_type = uploaded_file.type
        if 'pdf' in file_type:
            text_content = extract_text_from_pdf(uploaded_file)
            st.success("PDF processed successfully!")
            
            prompt = f"Please summarize the following text:\n\n{text_content}"
            response = st.session_state.conversation.predict(input=prompt)
        
        elif 'image' in file_type:
            st.image(uploaded_file, caption="Uploaded Image")
            response = describe_image(uploaded_file)
            st.success("Image processed successfully!")
        
        # Save the file response in session state
        st.session_state.file_response = response
        st.session_state.file_processed = True

        # Add response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
        st.session_state.memory.chat_memory.add_ai_message(response)
        save_chat_history(st.session_state.messages)

    except Exception as e:
        st.error(f"Error processing file: {str(e)}")

# Display file response if already processed
if st.session_state.file_response:
    st.markdown(f"**Analysis of the uploaded file:**\n\n{st.session_state.file_response}")

# Chat input for follow-up questions
if prompt := st.chat_input("Ask questions about the uploaded content"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.session_state.memory.chat_memory.add_user_message(prompt)
    
    with st.chat_message("user"):
        st.markdown(prompt)
    
    try:
        response = st.session_state.conversation.predict(input=prompt)
        st.session_state.messages.append({"role": "assistant", "content": response})
        st.session_state.memory.chat_memory.add_ai_message(response)
        
        with st.chat_message("assistant"):
            st.markdown(response)
        
        save_chat_history(st.session_state.messages)
    except Exception as e:
        st.error(f"Error communicating with Ollama: {str(e)}")
