// Mock notification data based on document content
const mockNotifications = [
  // Current notifications (last 3 days)
  {
    id: 1,
    type: 'compliance',
    priority: 'high',
    title: 'Safety Compliance Review Required',
    message: 'Annual safety guidelines review deadline is approaching. Metro Safety Guidelines 2025 document requires compliance verification by October 15, 2025.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    documentId: '1',
    documentTitle: 'Metro Safety Guidelines 2025',
    isRead: false,
    category: 'compliance'
  },
  {
    id: 2,
    type: 'reminder',
    priority: 'medium',
    title: 'Maintenance Schedule Due',
    message: 'Q4 2025 maintenance activities are scheduled to begin next week. Please review the maintenance schedule document and prepare necessary resources.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    documentId: '2',
    documentTitle: 'Maintenance Schedule Q4 2025',
    isRead: false,
    category: 'maintenance'
  },
  {
    id: 3,
    type: 'deadline',
    priority: 'high',
    title: 'Budget Report Submission',
    message: 'Annual budget report must be submitted to the board by October 18, 2025. Current budget allocation shows 95% utilization.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    documentId: '4',
    documentTitle: 'Annual Budget Report 2025',
    isRead: true,
    category: 'finance'
  },
  {
    id: 4,
    type: 'alert',
    priority: 'medium',
    title: 'Staff Training Update Required',
    message: 'Employee handbook has been updated with new policies. All staff must complete training acknowledgment by October 20, 2025.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    documentId: '3',
    documentTitle: 'Employee Handbook',
    isRead: true,
    category: 'hr'
  },
  {
    id: 5,
    type: 'info',
    priority: 'low',
    title: 'Customer Service Guidelines Updated',
    message: 'New customer service protocols have been added to improve passenger experience. Review updated guidelines at your convenience.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    documentId: '5',
    documentTitle: 'Customer Service Guidelines',
    isRead: false,
    category: 'customer-service'
  },

  // Past notifications (older than 3 days)
  {
    id: 6,
    type: 'compliance',
    priority: 'medium',
    title: 'Security Audit Completed',
    message: 'Monthly security audit has been completed. All systems are functioning within normal parameters.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    documentId: '6',
    documentTitle: 'Security Audit Report',
    isRead: true,
    category: 'security'
  },
  {
    id: 7,
    type: 'reminder',
    priority: 'low',
    title: 'Document Archive Scheduled',
    message: 'Quarterly document archiving process will begin next month. Ensure all important documents are properly tagged.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    documentId: null,
    documentTitle: null,
    isRead: true,
    category: 'system'
  },
  {
    id: 8,
    type: 'deadline',
    priority: 'high',
    title: 'Emergency Response Training Completed',
    message: 'All staff have successfully completed emergency response training. Certificates are now available for download.',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    documentId: '7',
    documentTitle: 'Emergency Response Training',
    isRead: true,
    category: 'training'
  }
];

export const notificationService = {
  // Get all notifications
  getAllNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return mockNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Get current notifications (last 3 days)
  getCurrentNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return mockNotifications
      .filter(notification => new Date(notification.timestamp) > threeDaysAgo)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Get past notifications (older than 3 days)
  getPastNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return mockNotifications
      .filter(notification => new Date(notification.timestamp) <= threeDaysAgo)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockNotifications.filter(notification => !notification.isRead).length;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
    return notification;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockNotifications.forEach(notification => {
      notification.isRead = true;
    });
    return true;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
      return true;
    }
    return false;
  },

  // Get notifications by category
  getNotificationsByCategory: async (category) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotifications
      .filter(notification => notification.category === category)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  // Get notifications by priority
  getNotificationsByPriority: async (priority) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotifications
      .filter(notification => notification.priority === priority)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};