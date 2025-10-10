import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  FileDownload as FileDownloadIcon,
  Description as DescriptionIcon,
  Summarize as SummarizeIcon,
} from '@mui/icons-material';
import { documentService } from '../services/documentService';

function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocumentById(id);
      setDocument(data);
    } catch (err) {
      setError('Failed to load document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      setSummaryLoading(true);
      const data = await documentService.getDocumentSummary(id);
      setSummary(data);
    } catch (err) {
      setError('Failed to generate summary');
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await documentService.downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Download failed');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !document) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/documents')} sx={{ mt: 2 }}>
          Back to Documents
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/documents')}
        sx={{ mb: 2 }}
      >
        Back to Documents
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              {document?.title}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {document?.description || 'No description provided'}
            </Typography>

            {document?.extractedText && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Extracted Content
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 400, overflow: 'auto' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {document.extractedText}
                  </Typography>
                </Paper>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Metadata
                </Typography>
                
                {document?.department && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1">{document.department}</Typography>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Upload Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(document?.uploadDate).toLocaleDateString()}
                  </Typography>
                </Box>

                {document?.fileType && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      File Type
                    </Typography>
                    <Typography variant="body1">{document.fileType}</Typography>
                  </Box>
                )}

                {document?.tags && document.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {document.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" color="primary" />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* AI Summary Section */}
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SummarizeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">AI Summary</Typography>
                </Box>

                {!summary && !summaryLoading && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={loadSummary}
                    startIcon={<SummarizeIcon />}
                  >
                    Generate Summary
                  </Button>
                )}

                {summaryLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {summary && (
                  <Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {summary.summary}
                    </Typography>
                    {summary.keyPoints && summary.keyPoints.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Key Points:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {summary.keyPoints.map((point, index) => (
                            <li key={index}>
                              <Typography variant="body2">{point}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default DocumentDetail;
