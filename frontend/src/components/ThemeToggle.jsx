import { IconButton, Tooltip, Box } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <Box
        component={motion.div}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '50%',
            padding: 1.5,
            background: (theme) =>
              isDarkMode
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'rotate(15deg)',
              boxShadow: isDarkMode
                ? '0 8px 25px rgba(102, 126, 234, 0.4)'
                : '0 8px 25px rgba(245, 87, 108, 0.4)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDarkMode
                ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                : 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
          }}
        >
          <Box
            component={motion.div}
            initial={false}
            animate={{
              rotate: isDarkMode ? 180 : 0,
              scale: isDarkMode ? 1 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            sx={{ zIndex: 1, position: 'relative' }}
          >
            {isDarkMode ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DarkMode />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LightMode />
              </motion.div>
            )}
          </Box>
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default ThemeToggle;