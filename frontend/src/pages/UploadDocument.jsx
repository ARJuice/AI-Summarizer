import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Stack,
  Divider,
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  Description as DescriptionIcon, 
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { addDocument } from '../store/documentSlice';
import { documentService } from '../services/documentService';

function UploadDocument() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('none');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate form sections with stagger
      gsap.from('.form-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate upload progress
  useEffect(() => {
    if (loading && uploadProgress < 90) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + Math.random() * 15, 90));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [loading, uploadProgress]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      setError(null);
      
      // Animate file selection with GSAP
      gsap.fromTo(
        '.file-preview',
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('department', department);
      formData.append('priority', priority);
      formData.append('tags', JSON.stringify(tags));

      const data = await documentService.uploadDocument(formData);
      dispatch(addDocument(data));
      setUploadProgress(100);
      setSuccess(true);

      // Success animation
      gsap.to(formRef.current, {
        scale: 1.02,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });

      setTimeout(() => {
        navigate('/documents');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
      setUploadProgress(0);
      gsap.to(formRef.current, {
        x: [0, -10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        width: '100%', 
        minHeight: '100vh',
        p: { xs: 2, sm: 3, md: 4 },
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      {/* Header Section */}
      <Box 
        ref={headerRef}
        sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          mb: 4, 
          textAlign: 'center' 
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mb: 2,
            background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 50%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          Upload Document
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Transform your documents with AI-powered analysis and smart organization
        </Typography>
      </Box>

      {/* Main Form Container */}
      <Box
        ref={formRef}
        component={Paper}
        elevation={0}
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 3,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: (theme) =>
            `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        }}
      >
        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                Document uploaded successfully! Redirecting...
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Progress */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="form-section"
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Uploading... {Math.round(uploadProgress)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                    background: 'linear-gradient(90deg, #2563eb, #8b5cf6)',
                  },
                }}
              />
            </Box>
          </motion.div>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* File Upload Zone */}
          <Box className="form-section">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Box
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                  border: (theme) =>
                    isDragActive
                      ? `3px solid ${theme.palette.primary.main}`
                      : `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 4,
                  mb: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? 'action.hover' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  style={{ display: 'none' }}
                />

                <CloudUploadIcon
                  sx={{
                    fontSize: 56,
                    color: isDragActive ? 'primary.main' : 'text.secondary',
                    mb: 2,
                    transition: 'color 0.3s ease',
                  }}
                />

                {file ? (
                  <Box className="file-preview">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                      <DescriptionIcon color="primary" />
                      <Typography variant="h6" color="primary">
                        {file.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {isDragActive ? 'Drop your file here' : 'Click or drag file to upload'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supported: PDF, Images (JPG, PNG), Word Documents
                    </Typography>
                  </>
                )}
              </Box>
            </motion.div>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Form Fields */}
          <Stack spacing={3}>
            <Box className="form-section">
              <TextField
                fullWidth
                label="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter a descriptive title"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Box className="form-section">
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                placeholder="Provide a brief description of the document"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="form-section">
              <TextField
                fullWidth
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Operations, HR, Finance"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Tags Section */}
            <Box className="form-section">
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Tags <Typography component="span" variant="caption" color="text.secondary">(Optional)</Typography>
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: 2, minWidth: 100 }}
                >
                  Add
                </Button>
              </Stack>

              <AnimatePresence>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <Chip
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        color="primary"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </AnimatePresence>
            </Box>
          </Stack>

          {/* Action Button */}
          <Box className="form-section" sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !file}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
                },
                transition: 'all 0.3s ease',
                '&:disabled': {
                  background: 'rgba(0,0,0,0.12)',
                },
              }}
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UploadDocument;