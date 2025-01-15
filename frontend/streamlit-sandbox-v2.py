import streamlit as st
from langchain_community.llms import Ollama
from openai import OpenAI
import os
from PIL import Image
import PyPDF2
import base64
import io
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def optimize_image(image, max_size=(300, 300)):
    """Optimize image size and quality for API processing"""
    # Calculate aspect ratio-preserving dimensions
    img_width, img_height = image.size
    ratio = min(max_size[0] / img_width, max_size[1] / img_height)
    new_size = (int(img_width * ratio), int(img_height * ratio))
    
    # Resize image
    image = image.resize(new_size, Image.Resampling.LANCZOS)
    
    # Convert to RGB if image is in RGBA mode
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    
    return image

def init_ollama_vision():
    return Ollama(model="llama3.2-vision:11b")

def init_openai_vision():
    # Initialize the OpenAI client with API key from environment variable
    client = OpenAI(api_key=os.getenv("API_KEY"))
    return client

def init_ollama_text():
    return Ollama(model="llama3.2:latest")

# extract text from pdf file
def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

# extract text from txt file
def extract_text_from_txt(txt_file):
    text = txt_file.read().decode('utf-8')
    return text

# extract text from image file
def extract_text_from_img(image_file):
    # Open and process the image
    image = Image.open(image_file)

    # Optimize the image
    image = optimize_image(image)

    # Convert PIL Image to base64 string
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    # Create prompt to extract text from image only
    prompt = ("Extract text from this image only. "
              "Do not include any other information.")
    
    try:
        # Initialize Ollama with vision model
        #llm = init_ollama_vision()
        llm = init_openai_vision()
        description=llm.chat.completions.create(model="gpt-4-turbo", messages=[{"role": "user", "content": [prompt,img_str]}], max_tokens=500)

        # Pass the base64 encoded image string
        # description = llm(prompt, images=[img_str])
        return description
    except Exception as e:
        raise Exception(f"Error generating description: {str(e)}")

# uploaded image description
def describe_image(image_file):
    try:
        # Open and process the image
        image = Image.open(image_file)

        # Optimize the image
        image = optimize_image(image)
        
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
            # llm = init_ollama_vision()

            llm = init_openai_vision()
            description=llm.chat.completions.create(model="gpt-4-turbo", messages=[{"role": "user", "content": [prompt,img_str]}], max_tokens=500)
            
            # Pass the base64 encoded image string (Ollama)
            # description = llm(prompt, images=[img_str])
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
uploaded_file = st.file_uploader("Upload a Text, PDF or Image file", type=['txt' ,'pdf', 'png', 'jpg', 'jpeg'])

if uploaded_file is not None:
    try:
        # Process based on file type
        file_type = uploaded_file.type

        if 'text' in file_type:
            text_content = extract_text_from_txt(uploaded_file)
            st.success("Text file processed successfully!")
            
            # Create prompt for summarization
            prompt = f"Please summarize the following text:\n\n{text_content}"
            
            # Generate summary using Ollama
            llm = init_ollama_text()
            response = llm(prompt)        

        if 'pdf' in file_type:
            text_content = extract_text_from_pdf(uploaded_file)
            st.success("PDF file processed successfully!")
            
            # Create prompt for summarization
            prompt = f"Please summarize the following text:\n\n{text_content}"
            
            # Generate summary using Ollama
            llm = init_ollama_text()
            response = llm(prompt)
            
        elif 'image' in file_type:
            # Display the uploaded image
            st.image(uploaded_file, caption="Uploaded Image")
            
            # Get image description
            response_img_describe = describe_image(uploaded_file)
            response_img_txt = extract_text_from_img(uploaded_file)
            st.success("Image processed successfully!")
        
        # Add the response to chat history
        st.session_state.messages.append({
            "role": "assistant", 
            "content": f"Analysis of uploaded file:\n\n{response_img_describe}"
        })

        st.session_state.messages.append({
            "role": "assistant", 
            "content": f"Text extracted from uploaded file:\n\n{response_img_txt}"
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
