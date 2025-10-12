import { IconButton, Box } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          color: (theme) => theme.palette.text.primary,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.hover,
            borderColor: (theme) => theme.palette.primary.main,
            transform: 'scale(1.1)',
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component={motion.div}
          initial={false}
          animate={{
            rotate: isDarkMode ? 180 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 10,
          }}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDarkMode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DarkMode sx={{ 
                fontSize: 20,
                color: '#90caf9', // Light blue for moon in dark mode
              }} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LightMode sx={{ 
                fontSize: 20,
                color: '#ffd700', // Golden yellow for sun in light mode
              }} />
            </motion.div>
          )}
        </Box>
      </IconButton>
    </Box>
  );
};

export default ThemeToggle;