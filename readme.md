Here’s a detailed **README.md** file template for your project. It highlights all key features and describes the planned implementation for your teammates and exhibition reviewers.

***

# MetroDocAI — AI-Powered Document Management System

## Project Overview

MetroDocAI is a modular, AI-powered, bilingual document management platform built for metro rail operations and suitable for academic exhibition. It streamlines document upload, tagging, classification, summarization, search, and compliance management—supporting both English and Malayalam.

***

## Features

- **Document Upload**
  - Upload PDFs, images, scans, and emails.
  - Manual entry of metadata/tags (title, department, tags, description, date).

- **Bilingual Support**
  - Processes documents in both English and Malayalam.
  - Multilingual interface toggle.

- **OCR Extraction**
  - Converts uploaded scans and images to text using Tesseract OCR.

- **Manual and AI Meta Tagging**
  - Users can assign tags at upload.
  - If skipped, AI auto-tags using extracted content and Varta-T5 model predictions.

- **AI-Powered Summarization**
  - Uses Gemini api key for summarization.
  - Shows key points, summaries, or action items.

- **Document Catalog & Search**
  - View uploaded documents, preview content, and download files.
  - Basic keyword/tag search for exhibition (expandable to advanced search).

- **Role-Based Dashboards**
  - User and (optional) admin views.
  - Personal document list and compliance alerts.

- **Compliance Notifications**
  - Displays alerts based on document type/tags.

- **Chatbot Assistant**
  - Gemini-powered or basic chatbot for guided help and workflow Q&A (demo only).

- **Audit Logging**
  - Tracks uploads, downloads, edits for demonstration.

- **Security**
  - Simple login system (JWT tokens).
  - Role-based access (user, admin).

***

## Tech Stack

- **Frontend:** React, Material UI, multilingual support (i18next). state management using Redux library.
- **Backend:** Spring Boot (Java), REST API
- **OCR:** Tesseract OCR via tess4j or Python service
- **AI/NLP:** HuggingFace Varta-T5 (Python microservice, FastAPI/Flask)
- **Database:** 
  - PostgreSQL: user accounts, document metadata, tags, logs
  - MongoDB: actual document files, extracted text, summaries
- **Security:** JWT for authentication, basic RBAC

***

## Implementation Plan

1. **Frontend**
   - Build upload, document list, tag entry, summary display, and search components.
   - Integrate language switch toggle.

2. **Backend API**
   - Create REST endpoints for upload, query, summary fetch, and tag assignment.
   - Interface with OCR and NLP modules as required.

3. **OCR Module**
   - Accept scans/images, return extracted text.
   - Integrate with backend for seamless workflow.

4. **AI Summarization Module**
   - Python service running Varta-T5 model.
   - Exposed endpoint for backend to request summary and suggested tags.

5. **Database Design**
   - PostgreSQL tables for users, metadata, tags.
   - MongoDB collections for document bodies and summaries.

6. **Search**
   - Basic SQL 'LIKE' query for exhibition.
   - Optionally expand to semantic search later.

7. **Security & Dashboard**
   - Implement JWT-based login.
   - Build personal dashboard for each user.

8. **Integration**
   - Define API contracts for all module interactions.
   - Use document_id (UUID) to correlate metadata and document content across DBs.

***

## Modular Development and Integration

- **Each teammate builds one module:**
  - Frontend UI, Backend API, OCR service, AI/NLP service, DB schema.
- **Mock APIs used for development.**
- **Integration steps:**
  1. Backend connects to DB, then to OCR and AI modules.
  2. Frontend interacts with backend once REST APIs are stable.
  3. Document flow: Upload → OCR → AI summarize/tag → save → view/search.

***

## Deployment and Exhibition

- Local deployment using Docker Compose or manual setup.
- Focus on clear, live demo flow: upload, summarize, search, display.
- No need for Apache Kafka/Elasticsearch unless system is expanded post-exhibition.

***

## Future Work

- Expand search capabilities.
- Advanced analytics dashboards.
- Mobile interface & multi-language support.
- Real-time collaboration.
- Integration with institutional systems (ERP, HR).

***

## Contributors

- Frontend: [Teammate Name]
- Backend: [Teammate Name]
- OCR: [Teammate Name]
- AI/NLP: [Teammate Name]
- Database: [Teammate Name]
- Security: [Teammate Name]

***

