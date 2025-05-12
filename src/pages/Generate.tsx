import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Box, Typography, Button, Paper } from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  maxWidth: '100% !important',
  padding: '0 !important',
  margin: 0,
  paddingTop: '64px',
  background: 'linear-gradient(135deg, #1a1f25 0%, #171b21 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  textAlign: 'center',
}));

const ContentBox = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.95), rgba(55, 59, 68, 0.95))',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  width: '100%',
  color: '#ffffff',
  border: '1px solid rgba(99, 132, 220, 0.1)',
  marginTop: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const OccasionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.8), rgba(55, 59, 68, 0.8))',
  backdropFilter: 'blur(10px)',
  color: '#ffffff',
  borderRadius: '12px',
  padding: theme.spacing(2, 4),
  border: '1px solid rgba(99, 132, 220, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(99, 132, 220, 0.2) 0%, rgba(45, 27, 105, 0.2) 100%)',
    border: '1px solid rgba(99, 132, 220, 0.2)',
    transform: 'translateY(-2px)',
  },
  '&.active': {
    background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
    boxShadow: '0 6px 20px rgba(99, 132, 220, 0.3)',
  },
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6384dc 0%, #7494ec 100%)',
  color: '#fff',
  padding: '12px 32px',
  borderRadius: '12px',
  marginTop: theme.spacing(4),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5374cc 0%, #6384dc 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(99, 132, 220, 0.3)',
  },
}));

type Occasion = 'BUSINESS' | 'PARTY' | 'CASUAL' | 'SPORTY' | 'FORMAL' | 'VACATION';

const occasions: Occasion[] = ['BUSINESS', 'PARTY', 'CASUAL', 'SPORTY', 'FORMAL', 'VACATION'];

interface GeneratedOutfit {
  top?: string;
  bottom?: string;
  shoes?: string;
  accessories?: string[];
}

const Generate = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [generatedOutfit, setGeneratedOutfit] = useState<GeneratedOutfit | null>(null);

  const handleGenerateOutfit = async () => {
    if (!selectedOccasion) return;
    
    try {
      // Add your outfit generation logic here
      setGeneratedOutfit({
        top: 'White T-shirt',
        bottom: 'Blue Jeans',
        shoes: 'Sneakers',
        accessories: ['Watch', 'Sunglasses']
      });
    } catch (error) {
      console.error('Error generating outfit:', error);
    }
  };

  return (
    <StyledContainer>
      <ContentContainer>
        <Typography variant="h4" sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: 2,
        }}>
          Outfit Generator
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 4 }}>
          Select an occasion and let AI create the perfect outfit for you
        </Typography>

        <ContentBox>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {occasions.map((occasion) => (
              <OccasionButton
                key={occasion}
                onClick={() => setSelectedOccasion(occasion)}
                className={selectedOccasion === occasion ? 'active' : ''}
              >
                {occasion}
              </OccasionButton>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GenerateButton
              onClick={handleGenerateOutfit}
              disabled={!selectedOccasion}
            >
              Generate Outfit
            </GenerateButton>
          </Box>

          {generatedOutfit && (
            <Box sx={{ 
              mt: 4,
              p: 3,
              borderRadius: '12px',
              background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.4), rgba(55, 59, 68, 0.4))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 132, 220, 0.1)',
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                Generated Outfit for {selectedOccasion}:
              </Typography>
              <Box sx={{ mt: 2 }}>
                {generatedOutfit.top && (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Top: {generatedOutfit.top}</Typography>
                )}
                {generatedOutfit.bottom && (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Bottom: {generatedOutfit.bottom}</Typography>
                )}
                {generatedOutfit.shoes && (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Shoes: {generatedOutfit.shoes}</Typography>
                )}
                {generatedOutfit.accessories && (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Accessories: {generatedOutfit.accessories.join(', ')}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </ContentBox>
      </ContentContainer>
    </StyledContainer>
  );
};

export default Generate; 