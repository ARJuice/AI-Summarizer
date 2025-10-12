import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { setDocuments, setLoading } from '../store/documentSlice';
import { documentService } from '../services/documentService';

function DocumentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { documents, loading } = useSelector((state) => state.documents);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

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
        <Box sx={{ display: 'flex', gap: 2 }}>
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
      </Paper>

      {/* Documents Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length > 0 ? (
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
