import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  FileDownload as FileDownloadIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import { setDocuments, setLoading } from '../store/documentSlice';
import { documentService } from '../services/documentService';

function DocumentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { documents, loading } = useSelector((state) => state.documents);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      dispatch(setLoading(true));
      const data = await documentService.getAllDocuments();
      dispatch(setDocuments(data));
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        dispatch(setLoading(true));
        const data = await documentService.searchDocuments(searchQuery);
        dispatch(setDocuments(data));
      } catch (err) {
        setError('Search failed');
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      loadDocuments();
    }
  };

  const handleDownload = async (docId, title) => {
    try {
      const blob = await documentService.downloadDocument(docId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Download failed');
      console.error(err);
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Document Catalog
        </Typography>
        <Button variant="contained" onClick={() => navigate('/upload')}>
          Upload New
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by title, tags, department, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          {searchQuery && (
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                loadDocuments();
              }}
            >
              Clear
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              borderRadius: '12px',
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'divider',
              p: 0.5,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated Background Slider */}
            <Box
              sx={{
                position: 'absolute',
                top: 4,
                left: viewMode === 'grid' ? 4 : '50%',
                width: 'calc(50% - 4px)',
                height: 'calc(100% - 8px)',
                bgcolor: 'primary.main',
                borderRadius: '8px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
            
            {/* Grid Button */}
            <Button
              onClick={() => setViewMode('grid')}
              sx={{
                position: 'relative',
                zIndex: 1,
                minWidth: '100px',
                px: 2.5,
                py: 1,
                color: viewMode === 'grid' ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'transparent',
                  opacity: 0.8,
                },
              }}
            >
              <ViewModuleIcon sx={{ mr: 0.75, fontSize: '1.2rem' }} />
              <Typography variant="button" fontWeight={viewMode === 'grid' ? 600 : 400}>
                Grid
              </Typography>
            </Button>
            
            {/* List Button */}
            <Button
              onClick={() => setViewMode('list')}
              sx={{
                position: 'relative',
                zIndex: 1,
                minWidth: '100px',
                px: 2.5,
                py: 1,
                color: viewMode === 'list' ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'transparent',
                  opacity: 0.8,
                },
              }}
            >
              <ViewListIcon sx={{ mr: 0.75, fontSize: '1.2rem' }} />
              <Typography variant="button" fontWeight={viewMode === 'list' ? 600 : 400}>
                List
              </Typography>
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Documents Grid or List with Smooth Transitions */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <Grid container spacing={3}>
                {documents.map((doc) => (
                  <Grid item xs={12} sm={6} md={4} key={doc.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': {
                          boxShadow: 4,
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
                            <DescriptionIcon sx={{ mr: 1, color: 'primary.main', flexShrink: 0 }} />
                            <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                              {doc.title}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {doc.description || 'No description'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {doc.department && (
                            <Chip label={doc.department} size="small" color="secondary" />
                          )}
                          {doc.priority && doc.priority !== 'none' && (
                            <Chip
                              label={doc.priority.charAt(0).toUpperCase() + doc.priority.slice(1)}
                              color={getPriorityColor(doc.priority)}
                              size="small"
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {doc.tags?.slice(0, 3).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                          {doc.tags?.length > 3 && (
                            <Chip label={`+${doc.tags.length - 3}`} size="small" variant="outlined" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/documents/${doc.id}`)}>
                          View Details
                        </Button>
                        <Button
                          size="small"
                          startIcon={<FileDownloadIcon />}
                          onClick={() => handleDownload(doc.id, doc.title)}
                        >
                          Download
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // List View
              <Box sx={{ width: '100%' }}>
                {documents.map((doc) => (
                  <Paper 
                    key={doc.id}
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': { 
                        boxShadow: 4,
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                        <DescriptionIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="div">
                            {doc.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doc.description || 'No description'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => navigate(`/documents/${doc.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FileDownloadIcon />}
                            onClick={() => handleDownload(doc.id, doc.title)}
                          >
                            Download
                          </Button>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                        {doc.department && (
                          <Chip label={doc.department} size="small" color="secondary" />
                        )}
                        {doc.priority && doc.priority !== 'none' && (
                          <Chip
                            label={doc.priority.charAt(0).toUpperCase() + doc.priority.slice(1)}
                            color={getPriorityColor(doc.priority)}
                            size="small"
                          />
                        )}
                        {doc.tags?.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No documents found
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/upload')}>
            Upload Your First Document
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default DocumentList;
