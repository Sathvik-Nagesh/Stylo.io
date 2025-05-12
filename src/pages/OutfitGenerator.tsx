import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  styled,
  Fade,
  Zoom,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { 
  AutoFixHigh as MagicIcon, 
  Refresh as RefreshIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  BusinessCenter as BusinessIcon,
  Celebration as PartyIcon,
  Park as CasualIcon,
  SportsBasketball as SportyIcon,
  Restaurant as FormalIcon,
  BeachAccess as VacationIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ClothingItem {
  _id: string;
  name: string;
  type: string;
  imageUrl: string;
  color: string;
  season: string;
  style: string;
}

interface Outfit {
  outfit: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    outerwear?: ClothingItem;
    shoes?: ClothingItem;
    accessories?: ClothingItem[];
  };
  score: number;
  colorHarmony: string;
  seasonCompatibility: string;
  styleCompatibility: string;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'center',
  '& .MuiToggleButton-root': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: '8px 16px',
    border: 'none',
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      color: 'white',
      '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
      },
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'scale(0.98)',
  opacity: 0,
  '&.visible': {
    transform: 'scale(1)',
    opacity: 1,
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: '10px 24px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const OutfitContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const occasions = [
  { value: 'business', label: 'Business', icon: <BusinessIcon /> },
  { value: 'party', label: 'Party', icon: <PartyIcon /> },
  { value: 'casual', label: 'Casual', icon: <CasualIcon /> },
  { value: 'sporty', label: 'Sporty', icon: <SportyIcon /> },
  { value: 'formal', label: 'Formal', icon: <FormalIcon /> },
  { value: 'vacation', label: 'Vacation', icon: <VacationIcon /> },
];

const OutfitGenerator = () => {
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedOccasion, setSelectedOccasion] = useState('casual');
  const [isGenerating, setIsGenerating] = useState(false);
  const theme = useTheme();

  const handleOccasionChange = (event: React.MouseEvent<HTMLElement>, newOccasion: string) => {
    if (newOccasion !== null) {
      setSelectedOccasion(newOccasion);
    }
  };

  const generateOutfit = async () => {
    setLoading(true);
    setError(null);
    setIsGenerating(true);
    try {
      const response = await axios.get<Outfit>(`http://localhost:5000/api/outfits/generate?occasion=${selectedOccasion}`);
      console.log('Generated outfit:', response.data);
      setOutfit(response.data);
    } catch (err) {
      console.error('Error generating outfit:', err);
      setError('Failed to generate outfit. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setIsGenerating(false), 300);
    }
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoriteOutfits', JSON.stringify(Array.from(newFavorites)));
  };

  const shareOutfit = () => {
    if (outfit) {
      const items = [
        outfit.outfit.top,
        outfit.outfit.bottom,
        outfit.outfit.outerwear,
        outfit.outfit.shoes,
        ...(outfit.outfit.accessories || [])
      ].filter(Boolean);

      const text = `Check out this outfit!\n\nItems:\n${items.map(item => `- ${item?.name} (${item?.type})`).join('\n')}`;
      navigator.clipboard.writeText(text);
      // You could add a toast notification here
    }
  };

  const renderClothingItem = (item: ClothingItem | undefined, title: string, index: number) => {
    if (!item) return null;

    return (
      <Zoom 
        in={!isGenerating} 
        style={{ 
          transitionDelay: `${index * 200}ms`,
          transitionDuration: '0.5s',
        }}
      >
        <StyledCard className={!isGenerating ? 'visible' : ''}>
          <CardMedia
            component="img"
            height="200"
            image={`http://localhost:5000${item.imageUrl}`}
            alt={item.name}
            sx={{ 
              objectFit: 'contain',
              transform: isGenerating ? 'scale(0.9)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip 
                label={item.type}
                size="small"
                sx={{ bgcolor: theme.palette.primary.light }}
              />
              <Chip 
                label={item.color}
                size="small"
                sx={{ bgcolor: theme.palette.secondary.light }}
              />
            </Stack>
          </CardContent>
        </StyledCard>
      </Zoom>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}>
            Outfit Generator
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Select an occasion and let AI create the perfect outfit for you
          </Typography>

          <StyledToggleButtonGroup
            value={selectedOccasion}
            exclusive
            onChange={handleOccasionChange}
            aria-label="occasion selection"
            sx={{ mb: 4 }}
          >
            {occasions.map((occasion) => (
              <ToggleButton 
                key={occasion.value} 
                value={occasion.value}
                aria-label={occasion.label}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  {occasion.icon}
                  <Typography>{occasion.label}</Typography>
                </Stack>
              </ToggleButton>
            ))}
          </StyledToggleButtonGroup>

          <StyledButton
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MagicIcon />}
            onClick={generateOutfit}
            disabled={loading}
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            {loading ? 'Generating...' : 'Generate Outfit'}
          </StyledButton>
        </Box>
      </Fade>

      {error && (
        <Fade in timeout={500}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {outfit && (
        <Fade in={!isGenerating} timeout={500}>
          <Box>
            <Paper 
              sx={{ 
                p: 3, 
                mb: 4, 
                bgcolor: 'background.paper',
                transform: isGenerating ? 'translateY(20px)' : 'translateY(0)',
                opacity: isGenerating ? 0 : 1,
                transition: 'all 0.5s ease',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label={`Score: ${outfit.score}/10`}
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={outfit.seasonCompatibility}
                    color="secondary"
                  />
                  <Chip 
                    label={outfit.styleCompatibility}
                    color="info"
                  />
                  <Chip 
                    label={outfit.colorHarmony}
                    color="success"
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Share outfit">
                    <IconButton onClick={shareOutfit}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate new outfit">
                    <IconButton onClick={generateOutfit}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Paper>

            <OutfitContainer>
              {renderClothingItem(outfit.outfit.top, 'Top', 0)}
              {renderClothingItem(outfit.outfit.bottom, 'Bottom', 1)}
              {renderClothingItem(outfit.outfit.outerwear, 'Outerwear', 2)}
              {renderClothingItem(outfit.outfit.shoes, 'Shoes', 3)}
            </OutfitContainer>

            {outfit.outfit.accessories && outfit.outfit.accessories.length > 0 && (
              <Fade in timeout={1000}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Suggested Accessories
                  </Typography>
                  <OutfitContainer>
                    {outfit.outfit.accessories.map((accessory, index) => 
                      renderClothingItem(accessory, 'Accessory', index + 4)
                    )}
                  </OutfitContainer>
                </Box>
              </Fade>
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default OutfitGenerator; 