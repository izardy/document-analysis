# Use Case for Digital Document AI Analysis Tool
## 1. Local Chatbot Companion 
- [x] Started
- [x] Progressing
- [x] Completed
### Business Logic Flow
```
---Tipical Office Worker
      |--- 1. Email Crafting
      |--- 2. Document summarization
      |--- 3. Code Assistance
      |--- 4. Discussion on new ideas
```
### AI Logic Flow
```
--- Install Ollama (as the local AI server)
      |--- 1. Check how to install here https://ollama.com/download
      |--- 2. Download the model via terminal (smallest model as it could fit to less performance device), run this code "ollama run llama3.2:1b"
      |--- 3. For those with GPU support machine (preferably 12Gb of VRAM) , can try to use AI with vision capability, run this code "ollama run llama3.2-vision"
      |--- 4. Straight Q&A from terminal
      |--- 5. If need to run from web interface read "How to Use?" section
              |--- Use case 1 : Chat only w/o documentation
              |--- Use case 2 : Chat with documentation upload (txt, pdf, jpg, png)
```
## 2. API Chatbot Companion 
- [x] Started
- [x] Progressing
- [ ] Completed
### Business Logic Flow
```
---Tipical Office Worker
      |--- 1. Email Crafting
      |--- 2. Document summarization
      |--- 3. Code Assistance
      |--- 4. Discussion on new ideas
```
### AI Logic Flow
```
--- Subscribe AI API (OpenAI, Claude, Bedrock, etc)
      |--- 1. Create the API key, store the key in .env file
      |--- 2. Load the API in the code and specify the model, for OpenAI GPT-4-turbo is the cheapest.
      |--- 3. GPT-4-turbo also have the vision capability, however for more advance model you can use GPT-4o
      |--- 4. Read "How to Use?" section on how to run this on web interface

```
## 3. Compliance on Digital Documents for Social Media Marketing
### Business Logic Flow
- [ ] Started
- [ ] Progressing
- [ ] Completed
```
---Marketing Team
      |--- 1. Generation of Marketing Materials
      |       |---Marketing Material 1 (Soc. Media Video)
      |       |---Marketing Material 2 (Soc. Media Images)
      |       |---Marketing Material 3 (Soc. Media Audio)
      |
      |--- 2. Approval for Marketing Materials
      |       |---Compliance Team                            
      |            |--- Checks & Evaluate Wording as per Guideline       
      |            |--- Checks & Evaluate Graphics as per Guideline      
      |            |--- Dissapprove (Notifiying email to recheck and regenerate material [1]) 
      |            |--- Approve (Notifiying email to approve for publishing in media [3]) 
      |
      |-- 3. Publish Marketing Materials
```
### AI Logic Flow
```
```
## 3. ....
### Business Logic Flow
```
```
## How to Use ?
- I work on this project using Python 3.9 , maybe you want to create your env using Python 3.9
- Git clone this repository ```git clone https://github.com/izardy/document-analysis.git```
- Change dir into this repository ```cd document-analysis```
- Activate your env and ```pip install -r requirements.txt```
- Change dir into frontend ```cd frontend```
- Experiment with your chatbot ```streamlit run streamlit-sandbox-general-chatbot-Ollama.py``` based on your use case preference

## Web App. Dev. Architecture
### Frontend
- [x] Streamlit for experimentation purpose
- [ ] Flask/Django (Python Based framework) for test/production
- [ ] React (JS based framework) for test/production

### Backend
#### Storage
- [ ] S3
- [ ] SQL : PostgreSQL/AWS Aurora
- [ ] NoSQL :
- 
#### Vectorstore
- [ ] ChromaDB : (Integration with either SQLite/PostgreSQL)

#### GenAI API
- [x] Ollama (LLM) : Llama3.2 (Dev - Experimentation)
- [x] Ollama (Image to Text) : Llama3.2-Vision (Dev - Experimentation)
- [ ] OpenAI API
- [ ] AWS Bedrock API (Dev, Test, Prod)
