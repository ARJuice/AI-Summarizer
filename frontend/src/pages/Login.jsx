import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authService } from '../services/authService';
import Squares from '../components/Squares';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const data = await authService.login({ email, password });
      dispatch(loginSuccess(data));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Squares Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: (theme) => theme.palette.mode === 'dark' ? 0.3 : 0.15,
        }}
      >
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#06b6d4'
          hoverFillColor={(theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9'}
        />
      </Box>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            backdropFilter: 'blur(10px)',
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
            border: (theme) => 
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{
                fontWeight: 700,
                background: (theme) => 
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MetroDocAI
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 3 }}>
              Welcome Back
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {/* Demo Credentials Info */}
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(37, 99, 235, 0.08)',
                border: (theme) => 
                  `1px solid ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)'}`,
              }}
            >
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Demo Credentials:
              </Typography>
              <Typography variant="body2">
                Email: <strong>admin@metrodoc.ai</strong>
              </Typography>
              <Typography variant="body2">
                Password: <strong>admin123</strong>
              </Typography>
            </Alert>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Login;
