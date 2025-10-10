# MetroDocAI - Frontend

React-based frontend for the MetroDocAI document management system.

## Tech Stack

- **React 18** with Vite
- **Material-UI (MUI)** for UI components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls

## Features Implemented

### 1. Authentication
- Login page with JWT token management
- Protected routes with authentication checks
- Automatic token refresh and logout on expiration

### 2. Dashboard
- Welcome screen with quick actions
- Document statistics
- Quick search functionality
- Recent documents display

### 3. Document Upload
- Drag-and-drop file upload interface
- Manual metadata entry (title, description, department)
- Tag management system
- Support for PDF, images, and Word documents
- Auto-population of title from filename

### 4. Document Catalog
- Grid view of all documents
- Search functionality (by title, tags, department, content)
- Document preview cards with metadata
- Download functionality
- Filter and sort capabilities

### 5. Document Detail View
- Full document information display
- Metadata panel (department, upload date, file type, tags)
- Extracted content display
- AI-powered summary generation (on-demand)
- Download functionality

### 6. Navigation
- Responsive navigation bar
- Quick access to Dashboard and Documents
- User profile display
- Logout functionality

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   └── PrivateRoute.jsx # Protected route wrapper
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── UploadDocument.jsx # Document upload
│   │   ├── DocumentList.jsx   # Document catalog
│   │   └── DocumentDetail.jsx # Document details
│   ├── services/           # API services
│   │   ├── api.js         # Axios instance with interceptors
│   │   ├── authService.js # Authentication API calls
│   │   └── documentService.js # Document API calls
│   ├── store/             # Redux store
│   │   ├── store.js       # Store configuration
│   │   ├── authSlice.js   # Auth state management
│   │   └── documentSlice.js # Document state management
│   ├── App.jsx            # Main app with routing
│   └── main.jsx           # Entry point
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## API Integration

The frontend expects the backend API to be running at the URL specified in `VITE_API_BASE_URL`.

### Expected API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

#### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents/upload` - Upload new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/search?q=query` - Search documents
- `GET /api/documents/:id/summary` - Get AI summary
- `GET /api/documents/:id/download` - Download document

## State Management

### Auth Slice
- User authentication state
- JWT token management
- Login/logout actions

### Document Slice
- Documents list
- Selected document
- Search query
- Loading and error states

## Development Notes

### Mock Data for Development
If the backend is not ready, you can modify the services to return mock data:

```javascript
// In documentService.js
export const documentService = {
  getAllDocuments: async () => {
    // Return mock data instead of API call
    return [
      {
        id: '1',
        title: 'Sample Document',
        description: 'This is a test document',
        department: 'Operations',
        tags: ['test', 'sample'],
        uploadDate: new Date().toISOString(),
      },
    ];
  },
};
```

### Adding New Features
1. Create new page components in `src/pages/`
2. Add routes in `App.jsx`
3. Create API service methods in `src/services/`
4. Update Redux slices if needed

## Styling

The app uses Material-UI's theming system. To customize the theme, edit `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your primary color
    },
    secondary: {
      main: '#dc004e', // Your secondary color
    },
  },
});
```

## Future Enhancements

- [ ] Add multilingual support (i18next)
- [ ] Implement advanced search filters
- [ ] Add document preview functionality
- [ ] Implement real-time notifications
- [ ] Add chatbot assistant component
- [ ] Add compliance alerts dashboard
- [ ] Implement audit log viewer
- [ ] Add user profile management
- [ ] Dark mode support

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend allows requests from `http://localhost:5173`.

### API Connection Issues
1. Check if backend is running
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check browser console for error messages

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributors

- Frontend Team: [Your Name]

## License

This project is part of the MetroDocAI academic exhibition project.


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
