import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';

const NotificationCenter = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [currentNotifications, setCurrentNotifications] = useState([]);
  const [pastNotifications, setPastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const [current, past] = await Promise.all([
        notificationService.getCurrentNotifications(),
        notificationService.getPastNotifications(),
      ]);
      setCurrentNotifications(current);
      setPastNotifications(past);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'compliance':
        return <WarningIcon color="warning" />;
      case 'deadline':
        return <ScheduleIcon color="error" />;
      case 'reminder':
        return <InfoIcon color="info" />;
      case 'alert':
        return <WarningIcon color="error" />;
      case 'info':
        return <InfoIcon color="primary" />;
      default:
        return <AssignmentIcon color="primary" />;
    }
  };

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

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationService.markAsRead(notification.id);
        // Update local state
        setCurrentNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
      }

      // Navigate to document if available
      if (notification.documentId) {
        onClose();
        navigate(`/documents/${notification.documentId}`);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setCurrentNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      setError('Failed to mark notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      setCurrentNotifications(prev => prev.filter(n => n.id !== notificationId));
      setPastNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const renderNotification = (notification) => (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <ListItem
        sx={{
          mb: 1,
          borderRadius: 2,
          backgroundColor: notification.isRead 
            ? 'transparent' 
            : (theme) => theme.palette.action.hover,
          border: (theme) => 
            `1px solid ${theme.palette.divider}`,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.selected,
          },
        }}
        onClick={() => handleNotificationClick(notification)}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {getNotificationIcon(notification.type)}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                {notification.title}
              </Typography>
              <Chip
                label={notification.priority}
                color={getPriorityColor(notification.priority)}
                size="small"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
              {!notification.isRead && (
                <Badge color="primary" variant="dot" />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {notification.message}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(notification.timestamp)}
                </Typography>
                {notification.documentTitle && (
                  <Typography variant="caption" color="primary">
                    {notification.documentTitle}
                  </Typography>
                )}
              </Box>
            </Box>
          }
        />
        <IconButton
          size="small"
          onClick={(e) => handleDeleteNotification(notification.id, e)}
          sx={{ ml: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItem>
    </motion.div>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              size="small"
              startIcon={<MarkEmailReadIcon />}
              onClick={handleMarkAllAsRead}
              disabled={loading}
            >
              Mark All Read
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          {error && (
            <Alert severity="error" sx={{ m: 1 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Current Notifications */}
              <Typography variant="subtitle1" sx={{ p: 1, fontWeight: 600 }}>
                Recent (Last 3 days)
              </Typography>
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {currentNotifications.length > 0 ? (
                    currentNotifications.map(renderNotification)
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No recent notifications"
                        secondary="You're all caught up!"
                      />
                    </ListItem>
                  )}
                </AnimatePresence>
              </List>

              {/* Past Notifications Toggle */}
              {pastNotifications.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => setShowPast(!showPast)}
                    sx={{ mb: 1 }}
                  >
                    {showPast ? 'Hide' : 'Show'} Past Notifications ({pastNotifications.length})
                  </Button>

                  {showPast && (
                    <>
                      <Typography variant="subtitle1" sx={{ p: 1, fontWeight: 600 }}>
                        Past Notifications
                      </Typography>
                      <List sx={{ p: 0 }}>
                        <AnimatePresence>
                          {pastNotifications.map(renderNotification)}
                        </AnimatePresence>
                      </List>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;