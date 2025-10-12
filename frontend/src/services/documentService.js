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
