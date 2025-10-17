# Backend Integration Guide for Java Developers

## 📋 Overview

This document provides everything your Java/Spring Boot backend team needs to integrate with the AI Summarizer frontend application.

---

## 🗂️ Key Files to Review

### 1. **Document Schema** (`/frontend/src/types/documentSchema.js`)
- **Complete API contract** with all endpoints
- **MongoDB document structure**
- **Request/Response formats**
- **Validation rules**
- **Example Java entity class**

### 2. **Document Service** (`/frontend/src/services/documentService.js`)
- **All API function calls** with detailed comments
- **Each function** documents the expected backend endpoint
- **Request parameters** and **response formats** clearly specified

### 3. **API Configuration** (`/frontend/src/services/api.js`)
- **Base URL configuration**
- **JWT token handling**
- **Request/Response interceptors**

---

## 🚀 Quick Start for Backend Integration

### Step 1: Set Up Base URL

```javascript
// File: frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api'; // Update to your backend URL
```

### Step 2: Turn Off Mock Mode

```javascript
// File: frontend/src/services/documentService.js
const MOCK_MODE = false; // Set to false when backend is ready
```

### Step 3: Implement Endpoints

All endpoints are documented in `/frontend/src/types/documentSchema.js`. Here's the priority list:

---

## 📡 Required Endpoints (Priority Order)

### 1. **Authentication** (High Priority)
```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me (get current user)
```

### 2. **Document Upload** (High Priority)
```
POST /api/documents/upload
```
- Content-Type: `multipart/form-data`
- Required fields: `file`, `title`, `department`
- Optional fields: `description`, `priority`, `tags`

### 3. **Get All Documents** (High Priority)
```
GET /api/documents
```
- Returns array of all documents for authenticated user
- Sort by `uploadDate` descending

### 4. **Get Document by ID** (High Priority)
```
GET /api/documents/:id
```
- Returns single document with all fields

### 5. **Search Documents** (Medium Priority)
```
GET /api/documents/search?q={query}
```
- Search in: title, description, tags, department, extractedText
- Case-insensitive partial matching

### 6. **Download Document** (Medium Priority)
```
GET /api/documents/:id/download
```
- Returns binary file stream
- Set `Content-Type` and `Content-Disposition` headers

### 7. **AI Summary** (Low Priority - Can be Phase 2)
```
GET /api/documents/:id/summary
```
- Returns AI-generated summary and key points

### 8. **Update Document** (Low Priority)
```
PUT /api/documents/:id
```
- Update document metadata (not file)

### 9. **Delete Document** (Low Priority)
```
DELETE /api/documents/:id
```
- Remove document and associated file

---

## 🗄️ MongoDB Schema

### Collection: `documents`

```javascript
{
  _id: ObjectId,                    // Auto-generated
  title: String,                    // Required, max 200 chars
  description: String,              // Optional, max 500 chars
  department: String,               // Required, enum (see schema file)
  priority: String,                 // Default: "none", enum: [high, medium, low, none]
  tags: [String],                   // Array of tags, max 10
  uploadDate: ISODate,              // Required, set to server time
  fileType: String,                 // Required: PDF, DOC, DOCX, JPG, PNG, etc.
  extractedText: String,            // Optional, TEXT/CLOB field
  fileName: String,                 // Original filename
  fileSize: Number,                 // File size in bytes
  filePath: String,                 // Storage path or URL
  userId: ObjectId,                 // Reference to user
  createdAt: ISODate,               // Auto timestamp
  updatedAt: ISODate                // Auto timestamp
}
```

### Recommended Indexes

```javascript
// 1. Upload date (for sorting)
db.documents.createIndex({ "uploadDate": -1 })

// 2. Department filter
db.documents.createIndex({ "department": 1 })

// 3. Full-text search
db.documents.createIndex({
  "title": "text",
  "description": "text", 
  "tags": "text",
  "extractedText": "text"
})

// 4. User documents
db.documents.createIndex({ "userId": 1, "uploadDate": -1 })
```

---

## 📝 Department Enum Values

These are the exact department values used in the frontend:

```
- Operations
- Maintenance
- Human Resources
- Finance
- Customer Service
- IT
- Management
- Environmental
- Engineering
- Procurement
```

**Important:** Use exact capitalization (e.g., "Human Resources", not "human resources")

---

## 🔐 Authentication

### JWT Token Format

The frontend expects JWT tokens in responses and sends them in headers:

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f191e810c19729de860ea",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## ✅ Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": { ... } or [ ... ],
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Descriptive error message",
  "code": "ERROR_CODE" // Optional
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created (for uploads)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid JWT)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📤 File Upload Handling

### Spring Boot Example

```java
@PostMapping("/api/documents/upload")
public ResponseEntity<?> uploadDocument(
    @RequestParam("file") MultipartFile file,
    @RequestParam("title") String title,
    @RequestParam("department") String department,
    @RequestParam(value = "description", required = false) String description,
    @RequestParam(value = "priority", required = false, defaultValue = "none") String priority,
    @RequestParam(value = "tags", required = false) String tags // Comma-separated
) {
    // 1. Validate file (size, type)
    // 2. Save file to storage (filesystem/S3)
    // 3. Extract text using Apache PDFBox or Tesseract OCR
    // 4. Parse tags (split by comma)
    // 5. Create document entity
    // 6. Save to MongoDB
    // 7. Return document object
}
```

### File Storage Recommendations
- **Local:** Store in `/uploads/documents/` with UUID filenames
- **Cloud:** Use AWS S3, Azure Blob Storage, or Google Cloud Storage
- **Naming:** Use UUID or MongoDB ObjectId to prevent conflicts

---

## 🔍 Search Implementation

### MongoDB Text Search

```java
// Using Spring Data MongoDB
@Query("{ $text: { $search: ?0 } }")
List<Document> searchDocuments(String query);
```

### Regex Search (Alternative)

```java
@Query("{ $or: [ " +
       "{ title: { $regex: ?0, $options: 'i' } }, " +
       "{ description: { $regex: ?0, $options: 'i' } }, " +
       "{ department: { $regex: ?0, $options: 'i' } }, " +
       "{ tags: { $regex: ?0, $options: 'i' } } " +
       "] }")
List<Document> searchDocuments(String query);
```

---

## 🤖 AI Integration (Optional - Phase 2)

For the document summarization feature:

### Options:
1. **OpenAI API** - GPT-4 for high-quality summaries
2. **Google Gemini** - Cost-effective alternative
3. **Local Model** - Hugging Face transformers (privacy-focused)
4. **Azure AI** - Microsoft's AI services

### Implementation:
- Extract first 5000 characters from `extractedText`
- Send to AI service with prompt: "Summarize this document in 3-4 sentences and provide 3-5 key points"
- Cache results in MongoDB to avoid re-processing
- Store in separate `summaries` collection or add to document

---

## 🧪 Testing Tips

### Test with Mock Data
The frontend has 12 mock documents - use these for testing your endpoints.

### Postman Collection
Import the API schema from `documentSchema.js` to create Postman requests.

### CORS Configuration
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173") // Vite dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 📞 Frontend Developer Contact Points

### Variable Names
- **Document ID:** `id` (string)
- **Upload Date:** `uploadDate` (ISO 8601 string)
- **File Type:** `fileType` (uppercase: "PDF", "DOC", etc.)
- **Tags:** `tags` (array of strings)
- **Department:** `department` (exact case as listed above)

### Date Format
Always use ISO 8601 in UTC timezone:
```
2025-10-15T14:30:00Z
```

### MongoDB ObjectId Conversion
Convert MongoDB `_id` (ObjectId) to string for `id` field in responses.

---

## 🚦 Development Workflow

1. **Start with Authentication** - Get login working first
2. **Implement Upload** - Core feature for testing
3. **Get All Documents** - Verify data flow
4. **Add Search** - Essential for usability
5. **Implement Download** - File streaming
6. **Add AI Summary** - Enhanced feature (optional for MVP)

---

## 📚 Additional Resources

- **MongoDB Java Driver:** https://mongodb.github.io/mongo-java-driver/
- **Spring Data MongoDB:** https://spring.io/projects/spring-data-mongodb
- **Apache PDFBox:** https://pdfbox.apache.org/ (PDF text extraction)
- **Tesseract OCR:** https://github.com/tesseract-ocr/tesseract (Image text extraction)
- **Multer Alternative (Java):** Apache Commons FileUpload or Spring MultipartFile

---

## ❓ FAQs

### Q: What if I can't match the exact response format?
A: The frontend has fallback handling (`response.data.data || response.data`), but try to match the schema for consistency.

### Q: Do I need to implement all endpoints at once?
A: No! Start with authentication, upload, and get all documents. Others can be added iteratively.

### Q: How should I handle file size limits?
A: Recommend 10MB max. Validate on backend and return clear error message.

### Q: What about file virus scanning?
A: Recommended for production. Use ClamAV or cloud service like AWS S3 malware scanning.

### Q: Should I store files in MongoDB?
A: No. Store files on filesystem/cloud storage. Store only file metadata and path in MongoDB.

---

## 🎯 Success Checklist

- [ ] Set up MongoDB with `documents` collection
- [ ] Create indexes for performance
- [ ] Implement JWT authentication
- [ ] Build document upload endpoint (multipart/form-data)
- [ ] Create get all documents endpoint
- [ ] Implement search functionality
- [ ] Add download endpoint (blob streaming)
- [ ] Configure CORS for frontend origin
- [ ] Test with frontend (set `MOCK_MODE = false`)
- [ ] Deploy and update `API_BASE_URL` in frontend

---

## 📧 Support

If you have questions about the frontend expectations or need clarification on any endpoint:

1. Check `documentSchema.js` for detailed specifications
2. Review `documentService.js` for example API calls
3. Look at mock data structure for expected format
4. Test endpoints with Postman before frontend integration

---

**Good luck with the backend development nigga! 🚀**
