# Use Case for Digital Document AI Analysis Tool
## 1. Local Chatbot Companion (No Documentation Upload)
- [x] Started
- [x] Progressing
- [x] Completed
### Business Logic Flow
>
---Tipical Office Worker
      |--- 1. Email Crafting
      |--- 2. Document summarization
      |--- 3. Code Assistance
      |--- 4. Discussion on new ideas

### AI Logic Flow
```
--- Install Ollama (as the local AI server)
      |--- 1. Pull
```
## 2. Compliance on Digital Documents for Social Media Marketing
### Business Logic Flow
- [x] Started
- [x] Progressing
- [x] Completed
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
