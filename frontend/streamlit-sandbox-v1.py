import streamlit as st
from langchain_community.llms import Ollama
from PIL import Image
import PyPDF2
import base64
import io

def init_ollama():
    return Ollama(model="llama3.2:latest")

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

def describe_image(image_file):
    try:
        # Open and process the image
        image = Image.open(image_file)
        
        # Convert PIL Image to base64 string
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Create a more detailed prompt
        prompt = ("Provide a detailed description of this image, including: "
                 "main subjects, colors, composition, lighting, setting, "
                 "and any notable details or activities shown.")
    
        try:
            # Initialize Ollama with vision model
            llm = init_ollama()
            
            # Pass the base64 encoded image string
            description = llm(prompt, images=[img_str])
            return description
        except Exception as e:
            raise Exception(f"Error generating description: {str(e)}")
            
    except Exception as e:
        raise Exception(f"Error loading image: {str(e)}")

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

        st.session_state.uploaded_file = None
        
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
