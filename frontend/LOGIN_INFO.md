# 🔐 Login Credentials for Testing

## Demo Accounts

### Admin Account
- **Email:** `admin@metrodoc.ai`
- **Password:** `admin123`
- **Role:** Administrator

### Demo User Account
- **Email:** `demo@metrodoc.ai`
- **Password:** `demo123`
- **Role:** Regular User

---

## 📋 Available Test Features

Once you log in, you can:

1. **Dashboard** - View overview and statistics
2. **Upload Documents** - Upload new documents with metadata
3. **Document Catalog** - View and search all documents
4. **Document Details** - View document info and generate AI summaries
5. **Download** - Download documents

## 🎯 Test Scenarios

### Scenario 1: Browse Existing Documents
1. Login with: `demo@metrodoc.ai` / `demo123`
2. Click "View All Documents" from dashboard
3. You'll see 5 pre-loaded sample documents
4. Click on any document to view details

### Scenario 2: Search Documents
1. From dashboard or documents page
2. Search for: `safety`, `maintenance`, or `budget`
3. Results will filter in real-time

### Scenario 3: Upload a New Document
1. Click "Go to Upload" or navigate to Upload page
2. Select any file (PDF, image, doc)
3. Fill in metadata:
   - Title: "Test Document"
   - Description: "This is a test upload"
   - Department: "Testing"
   - Tags: Add some tags like "test", "demo"
4. Click "Upload Document"
5. Document will appear in the catalog

### Scenario 4: Generate AI Summary
1. Go to Documents page
2. Click on "Metro Safety Guidelines 2025"
3. Click "Generate Summary" button
4. Wait 2 seconds (simulated AI processing)
5. View the AI-generated summary and key points

### Scenario 5: Download Document
1. View any document detail page
2. Click "Download" button
3. A mock file will be downloaded

---

## 📦 Pre-loaded Sample Documents

1. **Metro Safety Guidelines 2025** (Operations)
2. **Maintenance Schedule Q4 2025** (Maintenance)
3. **Employee Handbook** (Human Resources)
4. **Annual Budget Report 2025** (Finance)
5. **Customer Service Guidelines** (Customer Service)

---

## 🔧 Mock Mode

Currently running in **MOCK MODE** - all data is simulated locally. No backend required!

To switch to real backend:
1. Open `src/services/authService.js`
2. Change `MOCK_MODE = true` to `MOCK_MODE = false`
3. Open `src/services/documentService.js`
4. Change `MOCK_MODE = true` to `MOCK_MODE = false`
5. Update `.env` with your backend API URL

---

## 🚀 Quick Start

1. Open: http://localhost:5173/
2. Login with: `admin@metrodoc.ai` / `admin123`
3. Explore all features!

**Enjoy testing MetroDocAI! 🎉**
