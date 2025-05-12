import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6384dc',
      light: '#7494ec',
      dark: '#5374cc',
    },
    background: {
      default: '#1a1f2c',
      paper: 'rgba(26, 32, 44, 0.95)',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 32, 44, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '10px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6384dc 0%, #7494ec 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5374cc 0%, #6384dc 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          background: 'rgba(45, 55, 72, 0.6)',
          '&:hover': {
            borderColor: '#6384dc',
            background: 'rgba(45, 55, 72, 0.8)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(45, 55, 72, 0.6)',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6384dc',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#fff',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(45, 55, 72, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(99, 132, 220, 0.2)',
          borderRadius: '8px',
          color: '#fff',
          '&:hover': {
            background: 'rgba(99, 132, 220, 0.3)',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#fff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#fff',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#fff',
    },
    body1: {
      color: 'rgba(255, 255, 255, 0.9)',
    },
    body2: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default darkTheme; 