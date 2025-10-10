import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Logout as LogoutIcon, Dashboard as DashboardIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          MetroDocAI
        </Typography>
        <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
        <Button color="inherit" startIcon={<DescriptionIcon />} onClick={() => navigate('/documents')}>
          Documents
        </Button>
        <Box sx={{ ml: 2 }}>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
