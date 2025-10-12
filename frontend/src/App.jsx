import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import SmoothScrolling from './components/SmoothScrolling';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadDocument from './pages/UploadDocument';
import DocumentList from './pages/DocumentList';
import DocumentDetail from './pages/DocumentDetail';

function App() {
  return (
    <ThemeProvider>
      <SmoothScrolling>
        <Router>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <PrivateRoute>
                    <UploadDocument />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <PrivateRoute>
                    <DocumentList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/:id"
                element={
                  <PrivateRoute>
                    <DocumentDetail />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </SmoothScrolling>
    </ThemeProvider>
  );
}

export default App;
