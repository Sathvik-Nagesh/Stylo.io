import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  styled,
  Alert,
} from '@mui/material';
import { AutoFixHigh as WandIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const StyledContainer = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  background: 'linear-gradient(135deg, #1a1f25 0%, #171b21 100%)',
});

const GeneratePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  maxWidth: 800,
  width: '100%',
  marginTop: theme.spacing(4),
  background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.95), rgba(55, 59, 68, 0.95))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(99, 132, 220, 0.1)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const OutfitDisplay = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.4), rgba(55, 59, 68, 0.4))',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(99, 132, 220, 0.1)',
}));

const ItemCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.8), rgba(55, 59, 68, 0.8))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(99, 132, 220, 0.1)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(99, 132, 220, 0.2)',
    border: '1px solid rgba(99, 132, 220, 0.2)',
  },
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2, 4),
  background: 'linear-gradient(135deg, #6384dc 0%, #7494ec 100%)',
  color: '#fff',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5374cc 0%, #6384dc 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(99, 132, 220, 0.3)',
  },
}));

const ItemImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '12px',
  border: '1px solid rgba(99, 132, 220, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    border: '1px solid rgba(99, 132, 220, 0.2)',
  },
});

interface Outfit {
  top?: any;
  bottom?: any;
  shoes?: any;
  accessories?: any;
}

const GenerateOutfit: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('casual');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/outfits/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outfit');
      }

      const data = await response.json();
      setOutfit(data);
    } catch (err) {
      console.error('Error generating outfit:', err);
      setError('Failed to generate outfit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 800 }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #6384dc, #7494ec)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Generate Outfit
        </Typography>

        <GeneratePaper>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Theme</InputLabel>
            <Select
              value={theme}
              label="Theme"
              onChange={(e) => setTheme(e.target.value)}
              sx={{
                color: '#fff',
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(45, 49, 58, 0.95)',
                    backgroundImage: 'linear-gradient(145deg, rgba(45, 49, 58, 0.95), rgba(55, 59, 68, 0.95))',
                    backdropFilter: 'blur(10px)',
                    '& .MuiMenuItem-root': {
                      color: '#fff',
                      '&:hover': {
                        background: 'rgba(99, 132, 220, 0.1)',
                      },
                      '&.Mui-selected': {
                        background: 'rgba(99, 132, 220, 0.2)',
                        '&:hover': {
                          background: 'rgba(99, 132, 220, 0.3)',
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="sporty">Sporty</MenuItem>
              <MenuItem value="party">Party</MenuItem>
            </Select>
          </FormControl>

          <GenerateButton
            variant="contained"
            onClick={handleGenerate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <WandIcon />}
          >
            {loading ? 'Generating...' : 'Generate Outfit'}
          </GenerateButton>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%',
                background: 'rgba(211, 47, 47, 0.1)',
                border: '1px solid rgba(211, 47, 47, 0.3)',
                color: '#ff6b6b',
              }}
            >
              {error}
            </Alert>
          )}

          {outfit && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <OutfitDisplay>
                {Object.entries(outfit).map(([type, item]) => (
                  item && (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ItemCard>
                        <ItemImage
                          src={`http://localhost:5000${item.imageUrl}`}
                          alt={item.name}
                        />
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: '#fff',
                            fontWeight: 500,
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            textTransform: 'capitalize',
                          }}
                        >
                          {type}
                        </Typography>
                      </ItemCard>
                    </motion.div>
                  )
                ))}
              </OutfitDisplay>
            </motion.div>
          )}
        </GeneratePaper>
      </motion.div>
    </StyledContainer>
  );
};

export default GenerateOutfit; 