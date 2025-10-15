import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  Alert,
  Chip,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { setDocuments, setSearchQuery, setLoading } from '../store/documentSlice';
import { documentService } from '../services/documentService';
import CountUp from '../components/CountUp';
import { gsap } from 'gsap';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documents, searchQuery, loading } = useSelector((state) => state.documents);
  const { user } = useSelector((state) => state.auth);
  const [localSearch, setLocalSearch] = useState('');
  const welcomeRef = useRef(null);

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

  useEffect(() => {
    if (welcomeRef.current) {
      // Create a gradient animation
      gsap.to(welcomeRef.current, {
        backgroundPosition: '200% center',
        duration: 3,
        ease: 'none',
        repeat: -1,
      });
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      dispatch(setLoading(true));
      const data = await documentService.getAllDocuments();
      dispatch(setDocuments(data));
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = async () => {
    dispatch(setSearchQuery(localSearch));
    if (localSearch.trim()) {
      try {
        dispatch(setLoading(true));
        const data = await documentService.searchDocuments(localSearch);
        dispatch(setDocuments(data));
      } catch (error) {
        console.error('Error searching documents:', error);
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      loadDocuments();
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Typography
          ref={welcomeRef}
          variant="h4"
          component="div"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.75rem', md: '2.125rem' },
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 25%, #ec4899 50%, #8b5cf6 75%, #2563eb 100%)',
            backgroundSize: '200% auto',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome, {user?.name || 'User'}!
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                padding: '2px',
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6, #ec4899, #8b5cf6, #2563eb)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::before': {
                opacity: 0.6,
              },
            }}
          >
            <CardContent>
              <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Upload Document
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload PDFs, images, or scans
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/upload')}>
                Go to Upload
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                padding: '2px',
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6, #ec4899, #8b5cf6, #2563eb)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::before': {
                opacity: 0.6,
              },
            }}
          >
            <CardContent>
              <SearchIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Search Documents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find documents by keywords
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/documents')}>
                View All Documents
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                padding: '2px',
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6, #ec4899, #8b5cf6, #2563eb)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::before': {
                opacity: 0.6,
              },
            }}
          >
            <CardContent>
              <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Total Documents
              </Typography>
              <Typography variant="h3" color="primary">
                <CountUp
                  from={0}
                  to={documents.length}
                  separator=","
                  direction="up"
                  duration={1.5}
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search documents by title, tags, or content..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
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
        </Box>
      </Paper>

      {/* Recent Documents */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Documents
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : documents.length > 0 ? (
          <Box>
            {documents.slice(0, 5).map((doc) => (
              <Box
                key={doc.id}
                sx={{
                  p: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:hover': { 
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main',
                    transform: 'translateX(4px)',
                  },
                }}
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ flex: 1 }}>{doc.title}</Typography>
                  {doc.priority && doc.priority !== 'none' && (
                    <Chip
                      label={doc.priority.charAt(0).toUpperCase() + doc.priority.slice(1)}
                      color={getPriorityColor(doc.priority)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {doc.description}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Alert severity="info">No documents uploaded yet. Start by uploading your first document!</Alert>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard;
