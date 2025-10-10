import api from './api';

// Mock user data for testing without backend
const MOCK_MODE = true; // Set to false when backend is ready

const mockUsers = [
  {
    email: 'admin@metrodoc.ai',
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@metrodoc.ai',
      role: 'admin',
    },
  },
  {
    email: 'demo@metrodoc.ai',
    password: 'demo123',
    user: {
      id: '2',
      name: 'Demo User',
      email: 'demo@metrodoc.ai',
      role: 'user',
    },
  },
];

export const authService = {
  login: async (credentials) => {
    if (MOCK_MODE) {
      // Mock login - simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const user = mockUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        return {
          user: user.user,
          token: 'mock-jwt-token-' + user.user.id,
        };
      } else {
        throw {
          response: {
            data: {
              message: 'Invalid email or password',
            },
          },
        };
      }
    }
    
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    if (MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        user: {
          id: '3',
          name: userData.name,
          email: userData.email,
          role: 'user',
        },
        token: 'mock-jwt-token-3',
      };
    }
    
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    if (MOCK_MODE) {
      const token = localStorage.getItem('token');
      const userId = token?.split('-').pop();
      const user = mockUsers.find((u) => u.user.id === userId);
      return user ? user.user : mockUsers[0].user;
    }
    
    const response = await api.get('/auth/me');
    return response.data;
  },
};
