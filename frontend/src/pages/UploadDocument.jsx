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
  Card,
  CardContent,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  Description as DescriptionIcon, 
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Summarize as SummarizeIcon,
  AutoAwesome as AutoAwesomeIcon,
  ContentCopy as ContentCopyIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
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

  // AI Summarization states
  const [summaryLength, setSummaryLength] = useState('medium'); // short, medium, long
  const [summaryType, setSummaryType] = useState('general'); // general, detailed, keypoints
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [showSummary, setShowSummary] = useState(false);

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

  /**
   * Handle AI Summary Generation
   * @description Sends the uploaded file to backend for AI-powered text extraction and summarization
   * @backend_endpoint POST /api/documents/generate-summary
   * @param formData - Contains the file and summary preferences (length, type)
   * @backend_response { success: true, extractedText: string, summary: string, keyPoints: string[] }
   */
  const handleGenerateSummary = async () => {
    if (!file) {
      setSummaryError('Please upload a file first');
      return;
    }

    setGeneratingSummary(true);
    setSummaryError(null);
    setShowSummary(true);

    try {
      // Prepare form data for backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('summaryLength', summaryLength); // short (2-3 sentences), medium (4-6 sentences), long (7-10 sentences)
      formData.append('summaryType', summaryType); // general, detailed, keypoints

      // Call backend API to generate summary
      const response = await documentService.generateSummary(formData);

      setExtractedText(response.extractedText);
      setSummary(response);

      // Animate summary appearance
      gsap.fromTo(
        '.summary-card',
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)' }
      );
    } catch (err) {
      setSummaryError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  /**
   * Copy summary text to clipboard
   */
  const handleCopySummary = () => {
    if (summary) {
      const textToCopy = `${summary.summary}\n\nKey Points:\n${summary.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}`;
      navigator.clipboard.writeText(textToCopy);
      // Show success feedback
      gsap.to('.copy-button', {
        scale: [1, 1.2, 1],
        duration: 0.3,
      });
    }
  };

  /**
   * Download summary as text file
   */
  const handleDownloadSummary = () => {
    if (summary) {
      const textContent = `Document Summary\n${'='.repeat(50)}\n\nTitle: ${title}\nGenerated: ${new Date().toLocaleString()}\n\n${summary.summary}\n\nKey Points:\n${summary.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}\n\nExtracted Text:\n${'-'.repeat(50)}\n${extractedText}`;
      
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'document'}_summary.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
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
          Upload & Summarize
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
          Upload documents and get instant AI-powered summaries with key insights
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

          {/* AI Summarization Section */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Box className="form-section" sx={{ mt: 3 }}>
                  <Card
                    sx={{
                      background: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)',
                      border: (theme) =>
                        `1px solid ${theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)'}`,
                      borderRadius: 3,
                      overflow: 'visible',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)',
                            mr: 2,
                          }}
                        >
                          <AutoAwesomeIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                            AI-Powered Summarization
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Generate intelligent summaries with key insights
                          </Typography>
                        </Box>
                      </Box>

                      {/* Summary Configuration */}
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                            Summary Length
                          </Typography>
                          <ToggleButtonGroup
                            value={summaryLength}
                            exclusive
                            onChange={(e, value) => value && setSummaryLength(value)}
                            fullWidth
                            size="small"
                            sx={{
                              '& .MuiToggleButton-root': {
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&.Mui-selected': {
                                  background: 'linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)',
                                  color: 'white',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #1d4ed8 100%)',
                                  },
                                },
                              },
                            }}
                          >
                            <ToggleButton value="short">
                              Short (2-3 sentences)
                            </ToggleButton>
                            <ToggleButton value="medium">
                              Medium (4-6 sentences)
                            </ToggleButton>
                            <ToggleButton value="long">
                              Long (7-10 sentences)
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                            Summary Type
                          </Typography>
                          <ToggleButtonGroup
                            value={summaryType}
                            exclusive
                            onChange={(e, value) => value && setSummaryType(value)}
                            fullWidth
                            size="small"
                            sx={{
                              '& .MuiToggleButton-root': {
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&.Mui-selected': {
                                  background: 'linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)',
                                  color: 'white',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #1d4ed8 100%)',
                                  },
                                },
                              },
                            }}
                          >
                            <ToggleButton value="general">
                              General Summary
                            </ToggleButton>
                            <ToggleButton value="detailed">
                              Detailed Analysis
                            </ToggleButton>
                            <ToggleButton value="keypoints">
                              Key Points Only
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box>
                      </Stack>

                      {/* Generate Button */}
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleGenerateSummary}
                        disabled={generatingSummary}
                        startIcon={
                          generatingSummary ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <SummarizeIcon />
                          )
                        }
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #7c3aed 0%, #1d4ed8 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {generatingSummary ? 'Generating Summary...' : 'Generate AI Summary'}
                      </Button>

                      {/* Summary Error */}
                      {summaryError && (
                        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                          {summaryError}
                        </Alert>
                      )}

                      {/* Summary Result */}
                      <AnimatePresence>
                        {summary && showSummary && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="summary-card"
                          >
                            <Box
                              sx={{
                                mt: 3,
                                p: 3,
                                borderRadius: 2,
                                background: (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(0, 0, 0, 0.3)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                border: (theme) =>
                                  `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              {/* Summary Header with Actions */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mb: 2,
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <SummarizeIcon color="primary" />
                                  <Typography variant="h6" fontWeight={700}>
                                    Summary
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="Copy to clipboard">
                                    <IconButton
                                      size="small"
                                      onClick={handleCopySummary}
                                      className="copy-button"
                                      sx={{
                                        '&:hover': {
                                          background: (theme) =>
                                            theme.palette.mode === 'dark'
                                              ? 'rgba(139, 92, 246, 0.2)'
                                              : 'rgba(37, 99, 235, 0.1)',
                                        },
                                      }}
                                    >
                                      <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Download summary">
                                    <IconButton
                                      size="small"
                                      onClick={handleDownloadSummary}
                                      sx={{
                                        '&:hover': {
                                          background: (theme) =>
                                            theme.palette.mode === 'dark'
                                              ? 'rgba(139, 92, 246, 0.2)'
                                              : 'rgba(37, 99, 235, 0.1)',
                                        },
                                      }}
                                    >
                                      <FileDownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Regenerate">
                                    <IconButton
                                      size="small"
                                      onClick={handleGenerateSummary}
                                      sx={{
                                        '&:hover': {
                                          background: (theme) =>
                                            theme.palette.mode === 'dark'
                                              ? 'rgba(139, 92, 246, 0.2)'
                                              : 'rgba(37, 99, 235, 0.1)',
                                        },
                                      }}
                                    >
                                      <RefreshIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>

                              {/* Summary Text */}
                              <Typography
                                variant="body1"
                                sx={{
                                  lineHeight: 1.8,
                                  mb: 2,
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {summary.summary}
                              </Typography>

                              {/* Key Points */}
                              {summary.keyPoints && summary.keyPoints.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
                                  >
                                    <AutoAwesomeIcon fontSize="small" color="primary" />
                                    Key Points
                                  </Typography>
                                  <Stack spacing={1}>
                                    {summary.keyPoints.map((point, index) => (
                                      <Box
                                        key={index}
                                        sx={{
                                          display: 'flex',
                                          gap: 1.5,
                                          alignItems: 'flex-start',
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            minWidth: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                          }}
                                        >
                                          {index + 1}
                                        </Box>
                                        <Typography variant="body2" sx={{ flex: 1, pt: 0.3 }}>
                                          {point}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Stack>
                                </Box>
                              )}

                              {/* Extracted Text Preview */}
                              {extractedText && (
                                <Box sx={{ mt: 3 }}>
                                  <Divider sx={{ mb: 2 }} />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    fontWeight={600}
                                    sx={{ mb: 1, display: 'block' }}
                                  >
                                    EXTRACTED TEXT PREVIEW
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      maxHeight: 100,
                                      overflow: 'auto',
                                      p: 1.5,
                                      borderRadius: 1,
                                      background: (theme) =>
                                        theme.palette.mode === 'dark'
                                          ? 'rgba(255, 255, 255, 0.05)'
                                          : 'rgba(0, 0, 0, 0.03)',
                                      fontSize: '0.85rem',
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {extractedText}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

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