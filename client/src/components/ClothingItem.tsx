import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

// Constants
const BACKEND_URL = 'http://localhost:5000';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ImageContainer = styled('div')({
  position: 'relative',
  paddingTop: '100%', // 1:1 Aspect Ratio
  backgroundColor: '#f5f5f5',
  overflow: 'hidden',
});

const StyledImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ActionButtons = styled(Box)({
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  gap: '8px',
  zIndex: 1,
});

interface ClothingItemProps {
  item: {
    _id: string;
    name: string;
    type: string;
    color: string;
    season: string;
    style: string;
    imageUrl: string;
  };
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

const ClothingItem: React.FC<ClothingItemProps> = ({ item, onDelete, onToggleFavorite, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Construct the full image URL using the backend URL
  const fullImageUrl = item.imageUrl.startsWith('http') 
    ? item.imageUrl 
    : `${BACKEND_URL}${item.imageUrl}`;

  return (
    <StyledCard
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ActionButtons>
        <IconButton
          onClick={() => onToggleFavorite(item._id)}
          sx={{
            color: isFavorite ? 'red' : 'grey.400',
            bgcolor: 'white',
            '&:hover': { bgcolor: 'white' },
          }}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton
          onClick={() => onDelete(item._id)}
          sx={{
            color: 'grey.400',
            bgcolor: 'white',
            '&:hover': { bgcolor: 'white', color: 'error.main' },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ActionButtons>

      <ImageContainer>
        <StyledImage src={fullImageUrl} alt={item.name} />
      </ImageContainer>

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
          <Chip
            label={item.type}
            size="small"
            sx={{ bgcolor: 'primary.main', color: 'white' }}
          />
          <Chip
            label={item.style}
            size="small"
            sx={{ bgcolor: 'secondary.light' }}
          />
          <Chip
            label={item.season}
            size="small"
            sx={{ bgcolor: 'info.light' }}
          />
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ClothingItem; 