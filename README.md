# Use Case for Digital Document AI Analysis Tool
## 1. Compliance on Digital Documents for Social Media Marketing
### Business Logic Flow
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
## 2. ....
### Business Logic Flow
```
```

### AI Logic Flow

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
