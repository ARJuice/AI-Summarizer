/**
 * ========================================
 * DOCUMENT SCHEMA - FRONTEND TO BACKEND
 * ========================================
 * 
 * This file defines the data structure for documents used throughout the application.
 * Backend developers (Java/MongoDB) should use this as a reference for API contracts.
 * 
 * MongoDB Collection Name: "documents"
 * Database: AI-Summarizer (or your preferred name)
 */

/**
 * DOCUMENT MODEL
 * 
 * This represents a single document in the system.
 * All fields marked as "required" MUST be present in API responses.
 * Optional fields can be null/undefined.
 * 
 * MongoDB Document Structure:
 * {
 *   _id: ObjectId,  // MongoDB auto-generated ID (map to 'id' in frontend)
 *   title: String,
 *   description: String,
 *   department: String,
 *   priority: String,
 *   tags: [String],
 *   uploadDate: ISODate,
 *   fileType: String,
 *   extractedText: String,
 *   fileName: String,
 *   fileSize: Number,
 *   filePath: String,
 *   userId: ObjectId,  // Reference to user who uploaded
 *   createdAt: ISODate,
 *   updatedAt: ISODate
 * }
 */

export const DocumentSchema = {
  // ============ REQUIRED FIELDS ============
  
  /**
   * @field id
   * @type String
   * @required true
   * @mongoField _id (convert ObjectId to String)
   * @description Unique identifier for the document
   * @example "507f1f77bcf86cd799439011"
   */
  id: '',

  /**
   * @field title
   * @type String
   * @required true
   * @maxLength 200
   * @description Document title/name
   * @example "Metro Safety Guidelines 2025"
   */
  title: '',

  /**
   * @field department
   * @type String (ENUM)
   * @required true
   * @allowedValues [
   *   "Operations",
   *   "Maintenance", 
   *   "Human Resources",
   *   "Finance",
   *   "Customer Service",
   *   "IT",
   *   "Management",
   *   "Environmental",
   *   "Engineering",
   *   "Procurement"
   * ]
   * @description Department that owns/manages this document
   * @example "Operations"
   */
  department: '',

  /**
   * @field uploadDate
   * @type String (ISO 8601 DateTime)
   * @required true
   * @format YYYY-MM-DDTHH:mm:ssZ
   * @description When the document was uploaded (UTC timezone)
   * @example "2025-10-15T14:30:00Z"
   */
  uploadDate: '',

  /**
   * @field fileType
   * @type String
   * @required true
   * @allowedValues ["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG", "TXT"]
   * @description Type/extension of the uploaded file
   * @example "PDF"
   */
  fileType: '',

  // ============ OPTIONAL FIELDS ============

  /**
   * @field description
   * @type String
   * @required false
   * @maxLength 500
   * @default null
   * @description Brief description of the document content
   * @example "Comprehensive safety protocols for metro operations"
   */
  description: null,

  /**
   * @field priority
   * @type String (ENUM)
   * @required false
   * @allowedValues ["high", "medium", "low", "none"]
   * @default "none"
   * @description Document priority level
   * @example "high"
   */
  priority: 'none',

  /**
   * @field tags
   * @type Array<String>
   * @required false
   * @default []
   * @description Array of tags/keywords for searching
   * @example ["safety", "guidelines", "operations"]
   */
  tags: [],

  /**
   * @field extractedText
   * @type String (TEXT)
   * @required false
   * @default null
   * @description AI-extracted text content from the document
   * @maxLength unlimited (use TEXT/CLOB in database)
   * @example "Metro Safety Guidelines\n\nChapter 1: Introduction..."
   */
  extractedText: null,

  /**
   * @field fileName
   * @type String
   * @required false
   * @description Original filename from upload
   * @example "safety_guidelines_2025.pdf"
   */
  fileName: null,

  /**
   * @field fileSize
   * @type Number (bytes)
   * @required false
   * @description File size in bytes
   * @example 2048576 (2MB)
   */
  fileSize: null,

  /**
   * @field filePath
   * @type String
   * @required false
   * @description Storage path/URL for the actual file
   * @example "/uploads/documents/507f1f77bcf86cd799439011.pdf"
   */
  filePath: null,

  /**
   * @field userId
   * @type String
   * @required false
   * @description ID of user who uploaded the document
   * @example "507f191e810c19729de860ea"
   */
  userId: null,
};

/**
 * ========================================
 * API ENDPOINT SPECIFICATIONS
 * ========================================
 */

export const DocumentAPI = {
  baseURL: '/api/documents',

  /**
   * GET ALL DOCUMENTS
   * 
   * Endpoint: GET /api/documents
   * Auth: Required (JWT)
   * 
   * Response Format:
   * {
   *   success: true,
   *   data: [
   *     {
   *       id: "507f1f77bcf86cd799439011",
   *       title: "Metro Safety Guidelines",
   *       description: "Safety protocols...",
   *       department: "Operations",
   *       priority: "high",
   *       tags: ["safety", "guidelines"],
   *       uploadDate: "2025-10-15T14:30:00Z",
   *       fileType: "PDF",
   *       extractedText: "Full text...",
   *       fileName: "safety.pdf",
   *       fileSize: 2048576,
   *       filePath: "/uploads/...",
   *       userId: "507f191e810c19729de860ea"
   *     },
   *     // ... more documents
   *   ],
   *   count: 10
   * }
   */
  getAllDocuments: {
    method: 'GET',
    endpoint: '/api/documents',
    authRequired: true,
  },

  /**
   * GET DOCUMENT BY ID
   * 
   * Endpoint: GET /api/documents/:id
   * Auth: Required (JWT)
   * 
   * Response Format:
   * {
   *   success: true,
   *   data: {
   *     id: "507f1f77bcf86cd799439011",
   *     title: "Metro Safety Guidelines",
   *     ... (all fields from DocumentSchema)
   *   }
   * }
   */
  getDocumentById: {
    method: 'GET',
    endpoint: '/api/documents/:id',
    authRequired: true,
  },

  /**
   * UPLOAD DOCUMENT
   * 
   * Endpoint: POST /api/documents/upload
   * Auth: Required (JWT)
   * Content-Type: multipart/form-data
   * 
   * Request Body (FormData):
   * {
   *   file: File (required),
   *   title: String (required),
   *   description: String (optional),
   *   department: String (required),
   *   priority: String (optional, default: "none"),
   *   tags: String (optional, comma-separated: "tag1,tag2,tag3")
   * }
   * 
   * Response Format:
   * {
   *   success: true,
   *   message: "Document uploaded successfully",
   *   data: {
   *     id: "507f1f77bcf86cd799439011",
   *     ... (all fields from DocumentSchema)
   *   }
   * }
   */
  uploadDocument: {
    method: 'POST',
    endpoint: '/api/documents/upload',
    authRequired: true,
    contentType: 'multipart/form-data',
  },

  /**
   * SEARCH DOCUMENTS
   * 
   * Endpoint: GET /api/documents/search?q={query}
   * Auth: Required (JWT)
   * 
   * Query Parameters:
   * - q: String (search term)
   * - department: String (optional filter)
   * - priority: String (optional filter)
   * 
   * Search should match against:
   * - title (partial match, case-insensitive)
   * - description (partial match, case-insensitive)
   * - tags (exact match, case-insensitive)
   * - department (exact match, case-insensitive)
   * - extractedText (partial match, case-insensitive)
   * 
   * Response Format: Same as getAllDocuments
   */
  searchDocuments: {
    method: 'GET',
    endpoint: '/api/documents/search',
    authRequired: true,
  },

  /**
   * DOWNLOAD DOCUMENT
   * 
   * Endpoint: GET /api/documents/:id/download
   * Auth: Required (JWT)
   * 
   * Response: Binary file stream
   * Headers:
   * - Content-Type: application/pdf (or appropriate mime type)
   * - Content-Disposition: attachment; filename="document.pdf"
   */
  downloadDocument: {
    method: 'GET',
    endpoint: '/api/documents/:id/download',
    authRequired: true,
    responseType: 'blob',
  },

  /**
   * DELETE DOCUMENT
   * 
   * Endpoint: DELETE /api/documents/:id
   * Auth: Required (JWT)
   * 
   * Response Format:
   * {
   *   success: true,
   *   message: "Document deleted successfully"
   * }
   */
  deleteDocument: {
    method: 'DELETE',
    endpoint: '/api/documents/:id',
    authRequired: true,
  },

  /**
   * GET AI SUMMARY
   * 
   * Endpoint: GET /api/documents/:id/summary
   * Auth: Required (JWT)
   * 
   * Response Format:
   * {
   *   success: true,
   *   data: {
   *     summary: "Brief AI-generated summary...",
   *     keyPoints: [
   *       "Key point 1",
   *       "Key point 2",
   *       "Key point 3"
   *     ]
   *   }
   * }
   */
  getDocumentSummary: {
    method: 'GET',
    endpoint: '/api/documents/:id/summary',
    authRequired: true,
  },
};

/**
 * ========================================
 * ERROR RESPONSE FORMAT
 * ========================================
 * 
 * All error responses should follow this format:
 * {
 *   success: false,
 *   error: "Error message describing what went wrong",
 *   code: "ERROR_CODE" (optional)
 * }
 * 
 * Common HTTP Status Codes:
 * - 200: Success
 * - 201: Created (for uploads)
 * - 400: Bad Request (validation errors)
 * - 401: Unauthorized (missing/invalid JWT)
 * - 403: Forbidden (insufficient permissions)
 * - 404: Not Found (document doesn't exist)
 * - 500: Internal Server Error
 */

/**
 * ========================================
 * VALIDATION RULES
 * ========================================
 */

export const ValidationRules = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 200,
    pattern: /^[a-zA-Z0-9\s\-_.,()]+$/,
  },
  description: {
    required: false,
    maxLength: 500,
  },
  department: {
    required: true,
    enum: [
      'Operations',
      'Maintenance',
      'Human Resources',
      'Finance',
      'Customer Service',
      'IT',
      'Management',
      'Environmental',
      'Engineering',
      'Procurement',
    ],
  },
  priority: {
    required: false,
    enum: ['high', 'medium', 'low', 'none'],
    default: 'none',
  },
  tags: {
    required: false,
    maxCount: 10,
    maxLength: 30, // per tag
  },
  file: {
    required: true,
    maxSize: 10485760, // 10MB in bytes
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain',
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'],
  },
};

/**
 * ========================================
 * MONGODB INDEXES (for Java backend team)
 * ========================================
 * 
 * Recommended indexes for optimal performance:
 * 
 * 1. Primary Key Index (auto-created):
 *    db.documents.createIndex({ "_id": 1 })
 * 
 * 2. Department Index (for filtering):
 *    db.documents.createIndex({ "department": 1 })
 * 
 * 3. Upload Date Index (for sorting):
 *    db.documents.createIndex({ "uploadDate": -1 })
 * 
 * 4. Text Search Index (for full-text search):
 *    db.documents.createIndex({
 *      "title": "text",
 *      "description": "text",
 *      "tags": "text",
 *      "extractedText": "text"
 *    })
 * 
 * 5. User Documents Index:
 *    db.documents.createIndex({ "userId": 1, "uploadDate": -1 })
 * 
 * 6. Department + Priority Index:
 *    db.documents.createIndex({ "department": 1, "priority": 1 })
 */

/**
 * ========================================
 * EXAMPLE JAVA/SPRING BOOT ENTITY
 * ========================================
 * 
 * @Document(collection = "documents")
 * public class Document {
 *     @Id
 *     private String id;
 *     
 *     @NotBlank
 *     @Size(min = 3, max = 200)
 *     private String title;
 *     
 *     @Size(max = 500)
 *     private String description;
 *     
 *     @NotBlank
 *     private String department;
 *     
 *     private String priority = "none";
 *     
 *     private List<String> tags = new ArrayList<>();
 *     
 *     @NotNull
 *     private Date uploadDate;
 *     
 *     @NotBlank
 *     private String fileType;
 *     
 *     @Lob
 *     private String extractedText;
 *     
 *     private String fileName;
 *     private Long fileSize;
 *     private String filePath;
 *     private String userId;
 *     
 *     @CreatedDate
 *     private Date createdAt;
 *     
 *     @LastModifiedDate
 *     private Date updatedAt;
 *     
 *     // Getters and setters...
 * }
 */
