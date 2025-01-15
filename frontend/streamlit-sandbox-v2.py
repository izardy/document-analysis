from openai import OpenAI
import PyPDF2
import os
from dotenv import load_dotenv
import base64
import streamlit as st

load_dotenv()

def encode_image_to_base64(uploaded_file):
    return base64.b64encode(uploaded_file.getvalue()).decode('utf-8')

def describe_image(uploaded_file):
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Validate API key
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OpenAI API key not found in environment variables")
            
        # Validate uploaded file
        if uploaded_file is None:
            raise ValueError("No image file is uploaded")

        # Convert the uploaded file to base64
        base64_image = encode_image_to_base64(uploaded_file)

        response = client.chat.completions.create(
            model="gpt-4-turbo",  # Using the correct model for vision
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image in detail."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        raise Exception(f"Error describing image: {str(e)}")
    
def extract_text_from_img(image_path):
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Validate API key
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OpenAI API key not found in environment variables")
            
        # Validate image path
        if not image_path:
            raise ValueError("Image path cannot be empty")

        # Convert the image to base64
        base64_image = encode_image_to_base64(image_path)

        response = client.chat.completions.create(
            model="gpt-4-turbo",  # Using the correct model for vision
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract text from this image only. Do not include any other information."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        raise Exception(f"Error describing image: {str(e)}")

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
            
            # Generate summary using OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response_txt=client.chat.completions.create(model="gpt-4-turbo", 
                                                    messages=[{"role": "user", "content": [{"type": "text","text":prompt},]}], 
                                                    max_tokens=500).choices[0].message.content

            # Add the response to chat history of uploaded txt
            st.session_state.messages.append({
                "role": "assistant", 
                "content": f"Summary of the uploaded text file:\n\n{response_txt}"
            })

        if 'pdf' in file_type:
            text_content = extract_text_from_pdf(uploaded_file)
            st.success("PDF file processed successfully!")
            
            # Create prompt for summarization
            prompt = f"Please summarize the following text:\n\n{text_content}"
            
            # Generate summary using OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response_pdf=client.chat.completions.create(model="gpt-4-turbo", 
                                                    messages=[{"role": "user", "content": [{"type": "text","text":prompt},]}], 
                                                    max_tokens=500).choices[0].message.content  
            
            # Add the response to chat history of uploaded pdf
            st.session_state.messages.append({
                "role": "assistant", 
                "content": f"Summary of the uploaded pdf file:\n\n{response_pdf}"
            })
            
        elif 'image' in file_type:
            # Display the uploaded image
            st.image(uploaded_file, caption="Uploaded Image")
            
            # Get image description
            response_img_describe = describe_image(uploaded_file)
            response_img_txt = extract_text_from_img(uploaded_file)
            st.success("Image processed successfully!")
        
            # Add the response to chat history of uploaded image
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
        #client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response_follow_up=client.chat.completions.create(model="gpt-4-turbo", 
                                                messages=[{"role": "user", "content": [{"type": "text","text":prompt},]}], 
                                                max_tokens=500).choices[0].message.content 

        # Display assistant response
        with st.chat_message("assistant"):
            st.markdown(response_follow_up)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response_follow_up})
    
    except Exception as e:
        st.error(f"Error communicating with OpenAI API: {str(e)}")

# Add a button to clear chat history
if st.button("Clear Chat History"):
    st.session_state.messages = []
    st.experimental_rerun()
