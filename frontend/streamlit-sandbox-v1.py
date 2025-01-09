import streamlit as st
from langchain_community.llms import Ollama
from PIL import Image
import PyPDF2
import base64
import io

def init_ollama():
    return Ollama(model="llava-phi3")

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

def image_to_base64(image):
    # Convert PIL Image to base64 string
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

def describe_image(image_file):
    # Open and process the image
    image = Image.open(image_file)
    
    # Convert image to base64
    base64_image = image_to_base64(image)
    
    # Create prompt for image description
    prompt = "Please describe this image in detail."
    
    # Initialize Ollama with vision model
    llm = init_ollama()
    
    # Get image description using base64 image
    description = llm(prompt, images=[f"data:image/jpeg;base64,{base64_image}"])
    return description

# Create the Streamlit interface
st.title('Sandbox for Marketing Materials Compliance Analysis')

# Initialize chat history in session state if it doesn't exist
if 'messages' not in st.session_state:
    st.session_state.messages = []

# File uploader
uploaded_file = st.file_uploader("Upload a PDF or Image file", type=['pdf', 'png', 'jpg', 'jpeg'])

if uploaded_file is not None:
    try:
        # Process based on file type
        file_type = uploaded_file.type
        if 'pdf' in file_type:
            text_content = extract_text_from_pdf(uploaded_file)
            st.success("PDF processed successfully!")
            
            # Create prompt for summarization
            prompt = f"Please summarize the following text:\n\n{text_content}"
            
            # Generate summary using Ollama
            llm = init_ollama()
            response = llm(prompt)
            
        elif 'image' in file_type:
            # Display the uploaded image
            st.image(uploaded_file, caption="Uploaded Image")
            
            # Get image description
            response = describe_image(uploaded_file)
            st.success("Image processed successfully!")
        
        # Add the response to chat history
        st.session_state.messages.append({
            "role": "assistant", 
            "content": f"Analysis of uploaded file:\n\n{response}"
        })
        
    except Exception as e:
        st.error(f"Error processing file: {str(e)}")

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input for follow-up questions
if prompt := st.chat_input("Ask questions about the uploaded content"):
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

# Add a button to clear chat history
if st.button("Clear Chat History"):
    st.session_state.messages = []
    st.experimental_rerun()
