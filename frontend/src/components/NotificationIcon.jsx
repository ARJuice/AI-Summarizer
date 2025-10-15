import React, { useState, useEffect } from 'react';
import { IconButton, Badge } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { notificationService } from '../services/notificationService';
import NotificationCenter from './NotificationCenter';

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      setLoading(true);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setNotificationCenterOpen(true);
  };

  const handleNotificationCenterClose = () => {
    setNotificationCenterOpen(false);
    // Refresh unread count when notification center closes
    loadUnreadCount();
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          sx={{
            mr: 1,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                minWidth: 16,
                height: 16,
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
              },
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.1)',
                },
                '100%': {
                  transform: 'scale(1)',
                },
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </motion.div>

      <NotificationCenter
        open={notificationCenterOpen}
        onClose={handleNotificationCenterClose}
      />
    </>
  );
};

export default NotificationIcon;