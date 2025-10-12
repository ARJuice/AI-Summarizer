import api from './api';

// Mock mode for testing without backend
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
};

export const documentService = {
  // Upload document
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
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all documents
  getAllDocuments: async () => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDocuments;
    }
    
    const response = await api.get('/documents');
    return response.data;
  },

  // Get document by ID
  getDocumentById: async (id) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const doc = mockDocuments.find((d) => d.id === id);
      if (!doc) throw new Error('Document not found');
      return doc;
    }
    
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  // Search documents
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
    
    const response = await api.get(`/documents/search?q=${query}`);
    return response.data;
  },

  // Get document summary
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
    
    const response = await api.get(`/documents/${id}/summary`);
    return response.data;
  },

  // Update document metadata
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
    
    const response = await api.put(`/documents/${id}`, data);
    return response.data;
  },

  // Delete document
  deleteDocument: async (id) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      mockDocuments = mockDocuments.filter((d) => d.id !== id);
      return { message: 'Document deleted successfully' };
    }
    
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  // Download document
  downloadDocument: async (id) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Create a fake blob for download simulation
      const content = `Mock document content for document ID: ${id}\n\nThis is a simulated download.`;
      return new Blob([content], { type: 'application/pdf' });
    }
    
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
