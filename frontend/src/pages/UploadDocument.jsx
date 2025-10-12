import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Close as CloseIcon, Description, Add } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { addDocument, setLoading } from '../store/documentSlice';
import { documentService } from '../services/documentService';

function UploadDocument() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('none');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoadingState] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // GSAP animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.upload-header',
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      
      gsap.fromTo(
        '.upload-form',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Animate upload progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-populate title from filename if not set
      if (!title) {
        setTitle(selectedFile.name.split('.')[0]);
      }
      
      // Animate file selection
      gsap.fromTo(
        '.file-preview',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
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

    setLoadingState(true);
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
      gsap.to('.upload-form', {
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });

      // Reset form and navigate
      setTimeout(() => {
        navigate('/documents');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
      setUploadProgress(0);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} ref={formRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper 
          elevation={0}
          className="upload-form"
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: (theme) => 
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #1976d2, #dc004e, #1976d2)',
              backgroundSize: '200% 100%',
              animation: 'gradient 3s ease infinite',
            },
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        >
          <Box className="upload-header" sx={{ mb: 4, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  background: (theme) => 
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #90caf9 0%, #f48fb1 100%)'
                      : 'linear-gradient(135deg, #1976d2 0%, #dc004e 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                }}
              >
                Upload Document
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                }}
              >
                Transform your documents with AI-powered analysis. Upload PDFs, images, or scanned documents with smart metadata organization.
              </Typography>
            </motion.div>
          </Box>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem',
                    },
                  }} 
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'back.out(1.7)' }}
              >
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem',
                    },
                  }}
                >
                  Document uploaded successfully! Redirecting...
                </Alert>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Uploading... {Math.round(uploadProgress)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ 
                      borderRadius: 1,
                      height: 8,
                      backgroundColor: (theme) => 
                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                        background: 'linear-gradient(90deg, #1976d2, #dc004e)',
                      },
                    }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Enhanced File Upload */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  border: (theme) => 
                    isDragActive 
                      ? `2px solid ${theme.palette.primary.main}`
                      : `2px dashed ${theme.palette.divider}`,
                  borderRadius: 3,
                  p: 4,
                  mb: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: (theme) => 
                    isDragActive 
                      ? theme.palette.action.hover
                      : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { 
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-2px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: (theme) => 
                      `linear-gradient(90deg, transparent, ${theme.palette.primary.main}20, transparent)`,
                    transition: 'left 0.6s ease',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  style={{ display: 'none' }}
                />
                
                <motion.div
                  animate={{ 
                    y: isDragActive ? -10 : 0,
                    scale: isDragActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CloudUploadIcon 
                    sx={{ 
                      fontSize: 64, 
                      color: isDragActive ? 'primary.main' : 'text.secondary',
                      mb: 2,
                      transition: 'all 0.3s ease',
                    }} 
                  />
                </motion.div>
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {file ? (
                    <Box className="file-preview" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Description color="primary" />
                      {file.name}
                    </Box>
                  ) : isDragActive ? (
                    'Drop your file here'
                  ) : (
                    'Click to select or drag & drop your file'
                  )}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Supported: PDF, Images (JPG, PNG), Word Documents
                </Typography>
              </Box>
            </motion.div>

            {/* Enhanced Form Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <TextField
                fullWidth
                label="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <TextField
                fullWidth
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                margin="normal"
                placeholder="e.g., Operations, Maintenance, HR"
                sx={{ mb: 2 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority-select"
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </motion.div>

            {/* Enhanced Tags Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Tags (Optional - AI will auto-tag if skipped)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddTag}
                    startIcon={<Add />}
                    sx={{ 
                      borderRadius: 2,
                      minWidth: 100,
                    }}
                  >
                    Add
                  </Button>
                </Box>
                <AnimatePresence>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tags.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Chip
                          label={tag}
                          onDelete={() => handleDeleteTag(tag)}
                          color="primary"
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: 2,
                            },
                            transition: 'all 0.2s ease',
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </AnimatePresence>
              </Box>
            </motion.div>

            {/* Enhanced Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
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
                    fontSize: '1.1rem',
                    background: (theme) => 
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #90caf9 0%, #f48fb1 100%)'
                        : 'linear-gradient(135deg, #1976d2 0%, #dc004e 100%)',
                    '&:hover': {
                      background: (theme) => 
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #64b5f6 0%, #f06292 100%)'
                          : 'linear-gradient(135deg, #1565c0 0%, #c51162 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(0,0,0,0.12)',
                      color: 'rgba(0,0,0,0.26)',
                    },
                  }}
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    minWidth: 120,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 2,
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}

export default UploadDocument;