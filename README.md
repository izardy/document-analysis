# Automated Compliance Marketing System
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
### AI Logic Flow

## Web App. Dev. Architecture
### Frontend
- Streamlit for experimentation purpose
- xxx

### Backend
#### Storage
- S3
- SQL : PostgreSQL/AWS Aurora
- NoSQL :
- 
#### Vectorstore
- ChromaDB : (Integration with either SQLite/PostgreSQL)
#### GenAI API
- Ollama (LLM) : Llama3.2 (Dev - Experimentation)
- Ollama (Image to Text) : Llama3.2-Vision (Dev - Experimentation)
- AWS Bedrock API (Dev, Test, Prod)
