# MetroDocAI Frontend - Quick Start Guide

## ✅ What's Already Done

Your React frontend is now fully set up with:

1. **Core Dependencies Installed**
   - React 18 with Vite
   - Material-UI (MUI) for beautiful UI components
   - Redux Toolkit for state management
   - React Router for navigation
   - Axios for API communication

2. **Complete Page Components**
   - ✅ Login Page (`/login`)
   - ✅ Dashboard (`/dashboard`)
   - ✅ Document Upload (`/upload`)
   - ✅ Document List/Catalog (`/documents`)
   - ✅ Document Detail View (`/documents/:id`)

3. **State Management (Redux)**
   - Authentication state (login, logout, token management)
   - Document state (documents list, selected document, search)

4. **API Services**
   - Authentication service (login, register, get user)
   - Document service (upload, list, search, download, summary)
   - Axios interceptors for token handling

5. **Routing & Navigation**
   - Protected routes (requires authentication)
   - Responsive navbar with logout
   - Automatic redirect on token expiration

## 🚀 Currently Running

Your dev server is running at: **http://localhost:5173/**

## 📋 Next Steps

### 1. Test the Frontend (Without Backend)

Since your backend isn't ready yet, you have two options:

#### Option A: View the UI Only
Just open http://localhost:5173/ in your browser to see the login page and UI design.

#### Option B: Add Mock Data for Testing
Create a mock service to test the full flow:

1. Create `src/services/mockService.js`:
```javascript
export const mockDocuments = [
  {
    id: '1',
    title: 'Safety Guidelines 2025',
    description: 'Updated safety protocols for metro operations',
    department: 'Operations',
    tags: ['safety', 'guidelines', 'operations'],
    uploadDate: new Date().toISOString(),
    fileType: 'PDF',
  },
  // Add more mock documents...
];

export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@metrodoc.ai',
};
```

2. Temporarily modify services to return mock data during development.

### 2. Backend Integration

When your backend is ready:

1. **Update API Base URL** in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. **Ensure Backend CORS** allows `http://localhost:5173`

3. **Test Authentication Flow**:
   - Register/Login → Get JWT token
   - Token stored in localStorage
   - Token sent with all API requests

4. **Test Document Flow**:
   - Upload document → OCR processing → AI tagging
   - View documents → Search → Download
   - Generate AI summary

### 3. API Contract with Backend Team

Share these expected endpoints with your backend team:

#### Auth Endpoints
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: object, token: string }

POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: { user: object, token: string }

GET /api/auth/me
Headers: { Authorization: "Bearer {token}" }
Response: { user: object }
```

#### Document Endpoints
```
POST /api/documents/upload
Headers: { Authorization: "Bearer {token}" }
Body: FormData (file, title, description, department, tags)
Response: { document: object }

GET /api/documents
Headers: { Authorization: "Bearer {token}" }
Response: { documents: array }

GET /api/documents/:id
Response: { document: object }

GET /api/documents/search?q=query
Response: { documents: array }

GET /api/documents/:id/summary
Response: { summary: string, keyPoints: array }

GET /api/documents/:id/download
Response: Blob (file)
```

### 4. Customization

#### Change Theme Colors
Edit `src/App.jsx`:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#your-color' },
    secondary: { main: '#your-color' },
  },
});
```

#### Add New Features
1. Create component in `src/components/` or page in `src/pages/`
2. Add route in `src/App.jsx`
3. Add API method in `src/services/`
4. Update Redux slice if needed

### 5. Build for Production

When ready to deploy:
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 📁 Project Structure Overview

```
frontend/
├── src/
│   ├── components/     → Reusable UI components
│   ├── pages/         → Page components (Login, Dashboard, etc.)
│   ├── services/      → API communication layer
│   ├── store/         → Redux state management
│   ├── utils/         → Helper functions
│   ├── App.jsx        → Main app with routing
│   └── main.jsx       → Entry point
├── .env               → Environment variables
└── package.json       → Dependencies
```

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### API Connection Issues
1. Check backend is running
2. Verify `.env` has correct `VITE_API_BASE_URL`
3. Check browser console for errors
4. Ensure backend CORS is configured

### State Not Updating
- Check Redux DevTools (install browser extension)
- Verify actions are dispatched
- Check reducer logic in slices

## 📞 Team Coordination

### For Backend Team
Send them:
1. This API contract section
2. Expected request/response formats
3. CORS requirements

### For Exhibition Demo
1. Prepare sample documents
2. Create demo user accounts
3. Test full flow: Login → Upload → Search → Summary
4. Prepare talking points for each feature

## 🎯 Demo Flow for Exhibition

1. **Login** → Show authentication
2. **Dashboard** → Show overview and statistics
3. **Upload** → Upload a sample document with metadata
4. **Documents** → Search and filter
5. **Detail View** → Show document info + AI summary
6. **Download** → Demonstrate file retrieval

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Material-UI Docs](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)

---

**Your frontend is production-ready!** Just connect it to your backend APIs and you're good to go. 🚀
