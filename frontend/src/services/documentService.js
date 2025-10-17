/**
 * ========================================
 * DOCUMENT SERVICE - FRONTEND API CLIENT
 * ========================================
 * 
 * This service handles all document-related API calls.
 * Backend team: See /src/types/documentSchema.js for complete API specifications.
 * 
 * IMPORTANT FOR BACKEND INTEGRATION:
 * 1. Set MOCK_MODE = false when backend is ready
 * 2. Update API_BASE_URL in /src/services/api.js
 * 3. Ensure all endpoints match the schema in documentSchema.js
 * 4. Return MongoDB _id as 'id' in responses
 * 5. Use ISO 8601 format for dates: YYYY-MM-DDTHH:mm:ssZ
 * 6. Include JWT token in Authorization header
 */

import api from './api';

// ========================================
// CONFIGURATION
// ========================================

/**
 * @constant MOCK_MODE
 * @description Toggle between mock data and real backend API
 * @backend_action Set this to FALSE when Java backend is deployed
 */
const MOCK_MODE = true; // Set to false when backend is ready

// Mock documents data
let mockDocuments = [
  {
    id: '1',
    title: 'Metro Safety Guidelines 2025',
    description: 'Comprehensive safety protocols and guidelines for metro rail operations',
    department: 'Operations',
    priority: 'high',
    tags: ['safety', 'guidelines', 'operations', 'protocols'],
    uploadDate: '2025-10-01T10:30:00Z',
    fileType: 'PDF',
    extractedText: 'Metro Safety Guidelines\n\nChapter 1: Introduction\nThis document outlines the safety protocols and procedures for metro rail operations...\n\nKey Safety Requirements:\n1. All personnel must wear proper safety equipment\n2. Regular safety inspections are mandatory\n3. Emergency procedures must be followed at all times\n4. Report any safety hazards immediately\n\nChapter 2: Emergency Procedures...',
  },
  {
    id: '2',
    title: 'Maintenance Schedule Q4 2025',
    description: 'Scheduled maintenance activities for the fourth quarter',
    department: 'Maintenance',
    priority: 'medium',
    tags: ['maintenance', 'schedule', 'quarterly'],
    uploadDate: '2025-10-05T14:20:00Z',
    fileType: 'PDF',
    extractedText: 'Q4 2025 Maintenance Schedule\n\nOctober:\n- Track inspection: Week 1-2\n- Signal system maintenance: Week 3\n- Rolling stock servicing: Week 4\n\nNovember:\n- Power supply systems check\n- Platform safety equipment testing\n- CCTV system maintenance',
  },
  {
    id: '3',
    title: 'Employee Handbook',
    description: 'Complete guide for metro rail employees covering policies, benefits, and procedures',
    department: 'Human Resources',
    priority: 'low',
    tags: ['hr', 'employees', 'handbook', 'policies'],
    uploadDate: '2025-09-15T09:00:00Z',
    fileType: 'PDF',
    extractedText: 'Employee Handbook\n\nWelcome to Metro Rail Corporation!\n\nThis handbook contains important information about:\n- Company policies\n- Employee benefits\n- Work schedules\n- Code of conduct\n- Leave policies\n- Performance evaluation',
  },
  {
    id: '4',
    title: 'Annual Budget Report 2025',
    description: 'Financial report and budget allocation for the year 2025',
    department: 'Finance',
    priority: 'high',
    tags: ['finance', 'budget', 'annual', 'report'],
    uploadDate: '2025-09-30T16:45:00Z',
    fileType: 'PDF',
    extractedText: 'Annual Budget Report 2025\n\nTotal Budget: $50 Million\n\nAllocations:\n- Operations: 40%\n- Maintenance: 25%\n- Infrastructure: 20%\n- Administration: 10%\n- Contingency: 5%',
  },
  {
    id: '5',
    title: 'Customer Service Guidelines',
    description: 'Best practices and procedures for customer service staff',
    department: 'Customer Service',
    priority: 'none',
    tags: ['customer-service', 'guidelines', 'procedures'],
    uploadDate: '2025-10-08T11:30:00Z',
    fileType: 'PDF',
    extractedText: 'Customer Service Guidelines\n\nCore Principles:\n1. Always greet customers with a smile\n2. Listen actively to customer concerns\n3. Provide accurate information\n4. Resolve issues promptly\n5. Maintain professional demeanor',
  },
  {
    id: '6',
    title: 'Emergency Response Protocol',
    description: 'Critical procedures for emergency situations and crisis management',
    department: 'Operations',
    priority: 'high',
    tags: ['emergency', 'crisis', 'response', 'protocol'],
    uploadDate: '2025-10-10T08:15:00Z',
    fileType: 'PDF',
    extractedText: 'Emergency Response Protocol\n\nCritical Response Procedures:\n1. Immediate evacuation protocols\n2. Communication with emergency services\n3. Passenger safety management\n4. Media handling during emergencies\n\nLevel 1 Emergencies: Fire, Medical, Security\nLevel 2 Emergencies: Power outage, Equipment failure\nLevel 3 Emergencies: Weather-related disruptions',
  },
  {
    id: '7',
    title: 'IT Security Policy',
    description: 'Information technology security guidelines and data protection policies',
    department: 'IT',
    priority: 'medium',
    tags: ['security', 'it', 'data-protection', 'policy'],
    uploadDate: '2025-09-28T16:00:00Z',
    fileType: 'PDF',
    extractedText: 'IT Security Policy\n\nData Protection Guidelines:\n- Password requirements: minimum 12 characters\n- Two-factor authentication mandatory\n- Regular security training required\n- Incident reporting procedures\n\nNetwork Security:\n- VPN access for remote work\n- Regular security audits\n- Firewall configurations\n- Data backup protocols',
  },
  {
    id: '8',
    title: 'Training Manual - New Employees',
    description: 'Comprehensive training guide for new metro rail employees',
    department: 'Human Resources',
    priority: 'medium',
    tags: ['training', 'orientation', 'new-employees', 'manual'],
    uploadDate: '2025-09-20T10:45:00Z',
    fileType: 'PDF',
    extractedText: 'New Employee Training Manual\n\nWeek 1: Orientation and Safety\n- Company history and mission\n- Safety protocols and procedures\n- Emergency evacuation routes\n- Equipment familiarization\n\nWeek 2: Operations Training\n- Daily operational procedures\n- Customer service standards\n- Communication protocols\n- Performance expectations',
  },
  {
    id: '9',
    title: 'Quarterly Performance Review',
    description: 'Q3 2025 performance metrics and operational statistics',
    department: 'Management',
    priority: 'low',
    tags: ['performance', 'metrics', 'quarterly', 'review'],
    uploadDate: '2025-09-25T14:30:00Z',
    fileType: 'PDF',
    extractedText: 'Q3 2025 Performance Review\n\nKey Metrics:\n- On-time performance: 94.2%\n- Customer satisfaction: 4.3/5.0\n- Safety incidents: 3 (down from 7 in Q2)\n- Revenue: $12.5M (5% increase)\n\nAreas for Improvement:\n- Reduce average wait times\n- Enhance digital ticketing adoption\n- Improve station cleanliness scores',
  },
  {
    id: '10',
    title: 'Environmental Impact Report',
    description: 'Annual environmental sustainability and impact assessment',
    department: 'Environmental',
    priority: 'low',
    tags: ['environment', 'sustainability', 'impact', 'report'],
    uploadDate: '2025-09-12T11:20:00Z',
    fileType: 'PDF',
    extractedText: 'Environmental Impact Report 2025\n\nSustainability Initiatives:\n- 15% reduction in energy consumption\n- Implementation of solar panels at 3 stations\n- LED lighting upgrade completed\n- Waste reduction program launched\n\nEnvironmental Metrics:\n- Carbon footprint: 2,500 tons CO2 (down 8%)\n- Water usage: 125,000 gallons (down 12%)\n- Recycling rate: 67% (up from 58%)',
  },
  {
    id: '11',
    title: 'Infrastructure Upgrade Plan',
    description: 'Long-term infrastructure development and modernization strategy',
    department: 'Engineering',
    priority: 'high',
    tags: ['infrastructure', 'upgrade', 'modernization', 'development'],
    uploadDate: '2025-10-02T09:00:00Z',
    fileType: 'PDF',
    extractedText: 'Infrastructure Upgrade Plan 2025-2030\n\nMajor Projects:\n- Platform extension at 5 key stations\n- Signal system modernization\n- Track renewal program\n- Accessibility improvements\n\nBudget Allocation:\n- Signal systems: $15M\n- Track infrastructure: $22M\n- Station improvements: $8M\n- Accessibility: $5M\n\nTimeline: 5-year phased implementation',
  },
  {
    id: '12',
    title: 'Vendor Management Guidelines',
    description: 'Procedures for managing external vendors and service providers',
    department: 'Procurement',
    priority: 'none',
    tags: ['vendor', 'procurement', 'management', 'guidelines'],
    uploadDate: '2025-09-18T13:45:00Z',
    fileType: 'PDF',
    extractedText: 'Vendor Management Guidelines\n\nVendor Selection Criteria:\n- Technical capabilities and experience\n- Financial stability and references\n- Compliance with safety standards\n- Cost-effectiveness and value\n\nContract Management:\n- Regular performance reviews\n- Quality assurance processes\n- Payment terms and conditions\n- Dispute resolution procedures',
  },
];

// Mock summaries
const mockSummaries = {
  '1': {
    summary: 'This document provides comprehensive safety guidelines for metro rail operations. It covers essential safety protocols, equipment requirements, emergency procedures, and reporting mechanisms. The guidelines emphasize the importance of regular inspections, proper safety equipment usage, and immediate hazard reporting.',
    keyPoints: [
      'All personnel must wear proper safety equipment',
      'Regular safety inspections are mandatory',
      'Emergency procedures must be followed at all times',
      'Immediate reporting of safety hazards is required',
      'Comprehensive training for all staff members',
    ],
  },
  '2': {
    summary: 'The Q4 2025 maintenance schedule outlines planned maintenance activities across October, November, and December. It includes track inspections, signal system maintenance, rolling stock servicing, and various safety equipment checks to ensure optimal operation of the metro system.',
    keyPoints: [
      'Track inspection scheduled for October Week 1-2',
      'Signal system maintenance in Week 3',
      'Rolling stock servicing in Week 4',
      'Power supply systems check in November',
      'CCTV system maintenance included',
    ],
  },
  '3': {
    summary: 'The employee handbook serves as a comprehensive guide for metro rail employees. It covers company policies, employee benefits, work schedules, code of conduct, leave policies, and performance evaluation procedures.',
    keyPoints: [
      'Complete overview of company policies',
      'Details of employee benefits package',
      'Work schedule and shift information',
      'Code of conduct guidelines',
      'Leave policy and procedures',
    ],
  },
  '4': {
    summary: 'The annual budget report presents the financial allocation for 2025 with a total budget of $50 million. Major allocations include operations (40%), maintenance (25%), infrastructure (20%), administration (10%), and contingency funds (5%).',
    keyPoints: [
      'Total budget: $50 Million',
      'Operations receives largest allocation at 40%',
      'Maintenance allocated 25% of budget',
      'Infrastructure development: 20%',
      '5% contingency fund for emergencies',
    ],
  },
  '5': {
    summary: 'Customer service guidelines establish best practices for staff interacting with passengers. The document emphasizes professionalism, active listening, prompt issue resolution, and maintaining a positive attitude while serving customers.',
    keyPoints: [
      'Always greet customers professionally',
      'Practice active listening',
      'Provide accurate and helpful information',
      'Resolve issues promptly and efficiently',
      'Maintain professional demeanor at all times',
    ],
  },
  '6': {
    summary: 'Emergency response protocol defines critical procedures for managing crisis situations in the metro system. It establishes clear response levels, communication protocols, and evacuation procedures to ensure passenger and staff safety during emergencies.',
    keyPoints: [
      'Three-tier emergency response system',
      'Immediate evacuation protocols for all scenarios',
      'Direct communication with emergency services',
      'Passenger safety management procedures',
      'Media handling during crisis situations',
    ],
  },
  '7': {
    summary: 'IT security policy outlines comprehensive cybersecurity measures and data protection protocols. It covers password requirements, network security, access controls, and incident response procedures to protect metro system infrastructure.',
    keyPoints: [
      'Minimum 12-character password requirements',
      'Mandatory two-factor authentication',
      'VPN access for secure remote work',
      'Regular security audits and training',
      'Comprehensive data backup protocols',
    ],
  },
  '8': {
    summary: 'New employee training manual provides structured onboarding program for metro rail staff. It covers safety orientation, operational procedures, customer service standards, and performance expectations over a two-week training period.',
    keyPoints: [
      'Week 1 focuses on safety and orientation',
      'Week 2 covers operational training',
      'Company history and mission overview',
      'Equipment familiarization sessions',
      'Customer service standards training',
    ],
  },
  '9': {
    summary: 'Q3 2025 performance review analyzes key operational metrics including on-time performance, customer satisfaction, safety incidents, and revenue. The report identifies areas for improvement and sets targets for Q4.',
    keyPoints: [
      'On-time performance achieved 94.2%',
      'Customer satisfaction rating: 4.3/5.0',
      'Safety incidents reduced to 3 (down from 7)',
      'Revenue increased 5% to $12.5M',
      'Focus areas: wait times and digital adoption',
    ],
  },
  '10': {
    summary: 'Environmental impact report evaluates sustainability initiatives and environmental performance metrics. It highlights energy reduction achievements, waste management improvements, and carbon footprint reduction goals.',
    keyPoints: [
      '15% reduction in energy consumption achieved',
      'Solar panel installation at 3 stations',
      'LED lighting upgrade completed system-wide',
      'Carbon footprint reduced by 8%',
      'Recycling rate improved to 67%',
    ],
  },
  '11': {
    summary: 'Infrastructure upgrade plan outlines a comprehensive 5-year modernization strategy from 2025-2030. It details major projects including platform extensions, signal system upgrades, and accessibility improvements with allocated budgets.',
    keyPoints: [
      'Platform extension at 5 key stations planned',
      'Signal system modernization priority',
      'Track renewal program implementation',
      'Total budget allocation: $50M over 5 years',
      'Phased implementation approach adopted',
    ],
  },
  '12': {
    summary: 'Vendor management guidelines establish procedures for selecting, managing, and evaluating external service providers. It covers selection criteria, contract management, performance reviews, and dispute resolution processes.',
    keyPoints: [
      'Technical capability assessment required',
      'Financial stability verification mandatory',
      'Regular performance review processes',
      'Quality assurance protocols established',
      'Structured dispute resolution procedures',
    ],
  },
};

// ========================================
// DOCUMENT SERVICE API FUNCTIONS
// ========================================

export const documentService = {
  /**
   * UPLOAD DOCUMENT
   * 
   * @backend_endpoint POST /api/documents/upload
   * @param {FormData} formData - Contains file and metadata
   * @param {File} formData.file - Required: The document file
   * @param {string} formData.title - Required: Document title
   * @param {string} formData.description - Optional: Brief description
   * @param {string} formData.department - Required: Department enum value
   * @param {string} formData.priority - Optional: Priority level (default: "none")
   * @param {string} formData.tags - Optional: Comma-separated tags
   * 
   * @backend_response {
   *   success: true,
   *   message: "Document uploaded successfully",
   *   data: {
   *     id: "507f1f77bcf86cd799439011",
   *     title: "...",
   *     // ... all document fields (see documentSchema.js)
   *   }
   * }
   * 
   * @backend_notes
   * - Content-Type: multipart/form-data
   * - Store file in server filesystem or cloud storage
   * - Extract text using OCR/PDF parser library
   * - Set uploadDate to current server time (UTC)
   * - Convert MongoDB _id (ObjectId) to string for 'id' field
   */
  uploadDocument: async (formData) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newDoc = {
        id: String(mockDocuments.length + 1),
        title: formData.get('title'),
        description: formData.get('description'),
        department: formData.get('department'),
        priority: formData.get('priority') || 'none',
        tags: JSON.parse(formData.get('tags') || '[]'),
        uploadDate: new Date().toISOString(),
        fileType: formData.get('file')?.type || 'PDF',
        extractedText: 'Sample extracted text from uploaded document...',
      };
      
      mockDocuments.push(newDoc);
      return newDoc;
    }
    
    // Backend API call
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data; // Extract document from response wrapper
  },

  /**
   * GET ALL DOCUMENTS
   * 
   * @backend_endpoint GET /api/documents
   * @param none
   * 
   * @backend_response {
   *   success: true,
   *   data: [
   *     { id, title, description, department, ... }, // Array of document objects
   *     // ... more documents
   *   ],
   *   count: 15 // Optional: total count
   * }
   * 
   * @backend_notes
   * - Return ALL documents for the authenticated user
   * - Sort by uploadDate descending (newest first) by default
   * - Convert MongoDB _id to string 'id'
   * - Format uploadDate as ISO 8601 string
   */
  getAllDocuments: async () => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDocuments;
    }
    
    // Backend API call
    const response = await api.get('/documents');
    return response.data.data || response.data; // Handle both response formats
  },

  /**
   * GET DOCUMENT BY ID
   * 
   * @backend_endpoint GET /api/documents/:id
   * @param {string} id - Document ID (MongoDB ObjectId as string)
   * 
   * @backend_response {
   *   success: true,
   *   data: {
   *     id: "507f1f77bcf86cd799439011",
   *     title: "...",
   *     // ... all document fields
   *   }
   * }
   * 
   * @backend_error_404 {
   *   success: false,
   *   error: "Document not found"
   * }
   * 
   * @backend_notes
   * - Return complete document details
   * - Throw 404 if document doesn't exist
   * - Verify user has access to this document
   */
  getDocumentById: async (id) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const doc = mockDocuments.find((d) => d.id === id);
      if (!doc) throw new Error('Document not found');
      return doc;
    }
    
    // Backend API call
    const response = await api.get(`/documents/${id}`);
    return response.data.data || response.data;
  },

  /**
   * SEARCH DOCUMENTS
   * 
   * @backend_endpoint GET /api/documents/search?q={searchQuery}
   * @param {string} query - Search term entered by user
   * 
   * @backend_response {
   *   success: true,
   *   data: [
   *     { id, title, description, ... }, // Matching documents
   *   ]
   * }
   * 
   * @backend_notes
   * - Search should be case-insensitive
   * - Search in: title, description, tags, department, extractedText
   * - Use MongoDB $text search or $regex for pattern matching
   * - Partial matches should be supported
   * - Example: query="safety" should match "Metro Safety Guidelines"
   * - Example: query="hr" should match tags ["hr", "employees"]
   */
  searchDocuments: async (query) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const lowerQuery = query.toLowerCase();
      return mockDocuments.filter(
        (doc) =>
          doc.title.toLowerCase().includes(lowerQuery) ||
          doc.description.toLowerCase().includes(lowerQuery) ||
          doc.department.toLowerCase().includes(lowerQuery) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Backend API call
    const response = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
    return response.data.data || response.data;
  },

  /**
   * GET AI DOCUMENT SUMMARY
   * 
   * @backend_endpoint GET /api/documents/:id/summary
   * @param {string} id - Document ID
   * 
   * @backend_response {
   *   success: true,
   *   data: {
   *     summary: "Brief AI-generated summary of the document...",
   *     keyPoints: [
   *       "First key point",
   *       "Second key point",
   *       "Third key point"
   *     ]
   *   }
   * }
   * 
   * @backend_notes
   * - Use AI/ML service to generate summary from extractedText
   * - Summary should be 2-4 sentences
   * - keyPoints should be array of 3-5 bullet points
   * - Cache summaries to avoid re-processing
   * - This may take 2-5 seconds depending on document size
   */
  getDocumentSummary: async (id) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate AI processing time
      return mockSummaries[id] || {
        summary: 'AI-generated summary of the document. This provides a concise overview of the key points and main topics covered in the document.',
        keyPoints: [
          'Key point 1 from the document',
          'Key point 2 from the document',
          'Key point 3 from the document',
        ],
      };
    }
    
    // Backend API call
    const response = await api.get(`/documents/${id}/summary`);
    return response.data.data || response.data;
  },

  /**
   * UPDATE DOCUMENT METADATA
   * 
   * @backend_endpoint PUT /api/documents/:id
   * @param {string} id - Document ID
   * @param {Object} data - Fields to update
   * @param {string} data.title - Optional: New title
   * @param {string} data.description - Optional: New description
   * @param {string} data.department - Optional: New department
   * @param {string} data.priority - Optional: New priority
   * @param {Array<string>} data.tags - Optional: New tags array
   * 
   * @backend_response {
   *   success: true,
   *   message: "Document updated successfully",
   *   data: {
   *     id, title, ... // Updated document
   *   }
   * }
   * 
   * @backend_notes
   * - Only update fields that are provided in data object
   * - Validate new values against schema
   * - Update 'updatedAt' timestamp
   * - Return complete updated document
   */
  updateDocument: async (id, data) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = mockDocuments.findIndex((d) => d.id === id);
      if (index !== -1) {
        mockDocuments[index] = { ...mockDocuments[index], ...data };
        return mockDocuments[index];
      }
      throw new Error('Document not found');
    }
    
    // Backend API call
    const response = await api.put(`/documents/${id}`, data);
    return response.data.data || response.data;
  },

  /**
   * DELETE DOCUMENT
   * 
   * @backend_endpoint DELETE /api/documents/:id
   * @param {string} id - Document ID to delete
   * 
   * @backend_response {
   *   success: true,
   *   message: "Document deleted successfully"
   * }
   * 
   * @backend_error_404 {
   *   success: false,
   *   error: "Document not found"
   * }
   * 
   * @backend_notes
   * - Delete document from MongoDB
   * - Delete associated file from storage
   * - Verify user has permission to delete
   * - Return 404 if document doesn't exist
   */
  deleteDocument: async (id) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockDocuments = mockDocuments.filter((d) => d.id !== id);
      return { message: 'Document deleted successfully' };
    }
    
    // Backend API call
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  /**
   * DOWNLOAD DOCUMENT FILE
   * 
   * @backend_endpoint GET /api/documents/:id/download
   * @param {string} id - Document ID
   * 
   * @backend_response Binary file stream (Blob)
   * @backend_headers {
   *   'Content-Type': 'application/pdf' (or appropriate MIME type),
   *   'Content-Disposition': 'attachment; filename="document_name.pdf"'
   * }
   * 
   * @backend_notes
   * - Stream the actual file from storage
   * - Set appropriate Content-Type based on fileType
   * - Include original filename in Content-Disposition header
   * - Use file streaming for large files (don't load entire file in memory)
   * - Common MIME types:
   *   - PDF: application/pdf
   *   - DOC: application/msword
   *   - DOCX: application/vnd.openxmlformats-officedocument.wordprocessingml.document
   *   - JPG/JPEG: image/jpeg
   *   - PNG: image/png
   */
  downloadDocument: async (id) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Create a fake blob for download simulation
      const content = `Mock document content for document ID: ${id}\n\nThis is a simulated download.`;
      return new Blob([content], { type: 'application/pdf' });
    }
    
    // Backend API call
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob', // Important: Tell axios to handle binary data
    });
    return response.data; // Returns Blob directly
  },
};

// ========================================
// EXPORT
// ========================================
// Default export for easy import in components
