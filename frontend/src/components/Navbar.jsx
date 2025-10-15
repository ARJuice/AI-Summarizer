import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Logout as LogoutIcon, Dashboard as DashboardIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import ThemeToggle from './ThemeToggle';
import NotificationIcon from './NotificationIcon';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <AppBar 
        position="static" 
        sx={{
          background: (theme) => 
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: (theme) => 
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(25,118,210,0.3)',
        }}
      >
        <Toolbar>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                cursor: 'pointer',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} 
              onClick={() => navigate('/dashboard')}
            >
              MetroDocAI
            </Typography>
          </motion.div>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              color="inherit" 
              startIcon={<DashboardIcon />} 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                mr: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Dashboard
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              color="inherit" 
              startIcon={<DescriptionIcon />} 
              onClick={() => navigate('/documents')}
              sx={{ 
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Documents
            </Button>
          </motion.div>

          <NotificationIcon />
          
          <ThemeToggle />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton 
              color="inherit" 
              onClick={handleLogout} 
              title="Logout"
              sx={{ 
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </motion.div>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default Navbar;
