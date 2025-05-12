import React from 'react';
import { Fab, Tooltip, useTheme, keyframes } from '@mui/material';
import { AutoFixHigh as MagicIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(124, 77, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(124, 77, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(124, 77, 255, 0);
  }
`;

const FloatingGenerateButton = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Tooltip title="Generate Outfit" placement="left">
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          animation: `${pulse} 2s infinite`,
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
        onClick={() => navigate('/generate')}
      >
        <MagicIcon />
      </Fab>
    </Tooltip>
  );
};

export default FloatingGenerateButton; 