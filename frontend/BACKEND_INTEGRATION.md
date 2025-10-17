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

### 7. **Generate AI Summary** (High Priority - Core Feature)
```
POST /api/documents/generate-summary
```
- Content-Type: `multipart/form-data`
- Required fields: `file`
- Optional fields: `summaryLength` (short/medium/long), `summaryType` (general/detailed/keypoints)
- Returns: `extractedText`, `summary`, `keyPoints[]`
- **Note**: This is a separate endpoint from upload - generates summary without saving to database

### 8. **Get Document Summary** (Medium Priority)
```
GET /api/documents/:id/summary
```
- Returns AI-generated summary for already uploaded document
- Can cache results to avoid regenerating

### 9. **Update Document** (Low Priority)
```
PUT /api/documents/:id
```
- Update document metadata (not file)

### 10. **Delete Document** (Low Priority)
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

## 🤖 AI Summarization Integration (Core Feature - High Priority)

The AI summarization feature is a core part of this application. Users can upload documents and immediately get AI-generated summaries without saving to the database.

### Endpoint: POST /api/documents/generate-summary

**Purpose**: Extract text from uploaded documents and generate AI-powered summaries with configurable length and style.

### Request Format

```http
POST /api/documents/generate-summary
Content-Type: multipart/form-data

Fields:
- file (required): The document file (PDF, DOC, DOCX, JPG, PNG)
- summaryLength (optional): "short" | "medium" | "long"
- summaryType (optional): "general" | "detailed" | "keypoints"
```

### Response Format

```json
{
  "success": true,
  "data": {
    "extractedText": "Full text content extracted from the document...",
    "summary": "AI-generated summary based on preferences...",
    "keyPoints": [
      "Key insight 1",
      "Key insight 2",
      "Key insight 3",
      "Key insight 4",
      "Key insight 5"
    ]
  }
}
```

### Implementation Steps

#### Step 1: Text Extraction Libraries

Choose appropriate library based on file type:

**For PDFs:**
```java
// Using Apache PDFBox
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

public String extractTextFromPDF(MultipartFile file) throws IOException {
    try (PDDocument document = PDDocument.load(file.getInputStream())) {
        PDFTextStripper stripper = new PDFTextStripper();
        return stripper.getText(document);
    }
}
```

**For Images (OCR):**
```java
// Using Tesseract OCR
import net.sourceforge.tess4j.Tesseract;

public String extractTextFromImage(MultipartFile file) throws Exception {
    Tesseract tesseract = new Tesseract();
    tesseract.setDatapath("/path/to/tessdata"); // Set tesseract data path
    tesseract.setLanguage("eng");
    
    File tempFile = File.createTempFile("ocr-", ".jpg");
    file.transferTo(tempFile);
    
    String text = tesseract.doOCR(tempFile);
    tempFile.delete();
    
    return text;
}
```

**For Word Documents:**
```java
// Using Apache POI
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;

public String extractTextFromDocx(MultipartFile file) throws IOException {
    try (XWPFDocument document = new XWPFDocument(file.getInputStream());
         XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
        return extractor.getText();
    }
}
```

#### Step 2: AI Service Integration

**Option 1: OpenAI GPT-4 (Recommended)**

```java
// Add dependency: com.theokanning.openai-gpt3-java:service:0.18.2

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

public class OpenAIService {
    private final OpenAiService service;
    
    public OpenAIService(String apiKey) {
        this.service = new OpenAiService(apiKey);
    }
    
    public SummaryResponse generateSummary(
        String text, 
        String summaryLength, 
        String summaryType
    ) {
        // Build prompt based on preferences
        String prompt = buildPrompt(text, summaryLength, summaryType);
        
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("gpt-4")
            .messages(List.of(
                new ChatMessage("system", "You are a professional document summarizer."),
                new ChatMessage("user", prompt)
            ))
            .temperature(0.7)
            .maxTokens(1000)
            .build();
        
        String response = service.createChatCompletion(request)
            .getChoices().get(0).getMessage().getContent();
        
        return parseSummaryResponse(response);
    }
    
    private String buildPrompt(String text, String length, String type) {
        // Truncate text if too long (GPT-4 has token limits)
        String truncatedText = text.length() > 10000 
            ? text.substring(0, 10000) + "..." 
            : text;
        
        String lengthInstruction = switch(length) {
            case "short" -> "in 2-3 sentences";
            case "medium" -> "in 4-6 sentences";
            case "long" -> "in 7-10 sentences";
            default -> "in 4-6 sentences";
        };
        
        String typeInstruction = switch(type) {
            case "general" -> "Provide a general overview";
            case "detailed" -> "Provide a detailed analysis covering all major points";
            case "keypoints" -> "Focus on extracting key points only";
            default -> "Provide a general overview";
        };
        
        return String.format("""
            %s of the following document %s.
            Also extract 3-5 key points as a bulleted list.
            
            Document text:
            %s
            
            Format your response as:
            SUMMARY:
            [Your summary here]
            
            KEY POINTS:
            - Point 1
            - Point 2
            - Point 3
            """, typeInstruction, lengthInstruction, truncatedText);
    }
    
    private SummaryResponse parseSummaryResponse(String response) {
        // Parse the AI response to extract summary and key points
        String[] parts = response.split("KEY POINTS:");
        String summary = parts[0].replace("SUMMARY:", "").trim();
        
        List<String> keyPoints = new ArrayList<>();
        if (parts.length > 1) {
            String[] points = parts[1].split("\n");
            for (String point : points) {
                String cleaned = point.trim().replaceAll("^[-*•]\\s*", "");
                if (!cleaned.isEmpty()) {
                    keyPoints.add(cleaned);
                }
            }
        }
        
        return new SummaryResponse(summary, keyPoints);
    }
}
```

**Option 2: Google Gemini (Cost-Effective)**

```java
// Similar implementation using Google's Gemini API
// Endpoint: https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
```

**Option 3: Azure OpenAI (Enterprise)**

```java
// Use Azure OpenAI SDK with same OpenAI interface
// Better for compliance and data residency requirements
```

**Option 4: Local Model (Privacy-Focused)**

```java
// Use Hugging Face transformers with BART or Pegasus models
// Requires more memory and processing power
// No external API calls - all processing on-premises
```

#### Step 3: Complete Controller Implementation

```java
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    
    @Autowired
    private TextExtractionService textExtractionService;
    
    @Autowired
    private AIService aiService;
    
    @PostMapping("/generate-summary")
    public ResponseEntity<?> generateSummary(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "summaryLength", defaultValue = "medium") String summaryLength,
        @RequestParam(value = "summaryType", defaultValue = "general") String summaryType
    ) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "File is required"));
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (!isValidFileType(contentType)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Invalid file type"));
            }
            
            // Extract text based on file type
            String extractedText;
            if (contentType.contains("pdf")) {
                extractedText = textExtractionService.extractTextFromPDF(file);
            } else if (contentType.contains("image")) {
                extractedText = textExtractionService.extractTextFromImage(file);
            } else if (contentType.contains("word")) {
                extractedText = textExtractionService.extractTextFromDocx(file);
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Unsupported file type"));
            }
            
            // Validate extracted text
            if (extractedText == null || extractedText.trim().isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "error", "No text could be extracted from the document. The file may be empty or contain only images."
                ));
            }
            
            // Generate AI summary
            SummaryResponse summary = aiService.generateSummary(
                extractedText, 
                summaryLength, 
                summaryType
            );
            
            // Build response
            Map<String, Object> response = Map.of(
                "success", true,
                "data", Map.of(
                    "extractedText", extractedText,
                    "summary", summary.getSummary(),
                    "keyPoints", summary.getKeyPoints()
                )
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "error", "Failed to generate summary: " + e.getMessage()
                ));
        }
    }
    
    private boolean isValidFileType(String contentType) {
        return contentType != null && (
            contentType.contains("pdf") ||
            contentType.contains("image") ||
            contentType.contains("word") ||
            contentType.contains("document")
        );
    }
}
```

### Dependencies Required

Add to `pom.xml`:

```xml
<!-- PDF Processing -->
<dependency>
    <groupId>org.apache.pdfbox</groupId>
    <artifactId>pdfbox</artifactId>
    <version>3.0.0</version>
</dependency>

<!-- OCR for Images -->
<dependency>
    <groupId>net.sourceforge.tess4j</groupId>
    <artifactId>tess4j</artifactId>
    <version>5.8.0</version>
</dependency>

<!-- Word Document Processing -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>

<!-- OpenAI API Client -->
<dependency>
    <groupId>com.theokanning.openai-gpt3-java</groupId>
    <artifactId>service</artifactId>
    <version>0.18.2</version>
</dependency>
```

### Configuration

Add to `application.properties`:

```properties
# OpenAI Configuration
openai.api.key=${OPENAI_API_KEY}
openai.model=gpt-4
openai.max.tokens=1000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Tesseract OCR Configuration
tesseract.data.path=/usr/share/tesseract-ocr/4.00/tessdata
tesseract.language=eng
```

### Error Handling

Common issues and solutions:

1. **Empty text extraction**: File may be image-only PDF or corrupted
2. **OCR accuracy**: Low-quality scans may produce gibberish
3. **API rate limits**: Implement retry logic with exponential backoff
4. **Token limits**: Truncate long documents before sending to AI
5. **Timeout**: AI services can take 5-10 seconds for long documents

### Performance Optimization

1. **Caching**: Cache summaries to avoid regenerating for same file
2. **Async Processing**: Use @Async for long-running summarization
3. **Queue System**: Use RabbitMQ/Kafka for high-volume processing
4. **Text Chunking**: Split large documents and summarize in parts

### Security Considerations

1. **Rate Limiting**: Prevent abuse of expensive AI API calls
2. **File Validation**: Verify file types and scan for malware
3. **Text Sanitization**: Remove sensitive data before sending to AI
4. **API Key Security**: Store OpenAI key in environment variables, not code

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
