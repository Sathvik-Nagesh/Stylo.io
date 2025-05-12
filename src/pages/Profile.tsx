import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  Stack,
  Chip,
  IconButton,
  styled,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Style as StyleIcon,
} from '@mui/icons-material';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  maxWidth: '100% !important',
  padding: '0 !important',
  margin: 0,
  paddingTop: '64px',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(45, 27, 105, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '400px',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  fontSize: '2.5rem',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(99, 132, 220, 0.15), rgba(116, 148, 236, 0.15))',
  border: '1px solid rgba(99, 132, 220, 0.2)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(145deg, rgba(99, 132, 220, 0.25), rgba(116, 148, 236, 0.25))',
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: theme.spacing(4),
  '& > div': {
    textAlign: 'center',
  },
}));

const StatIcon = styled('div')(({ theme }) => ({
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
  color: '#6384dc',
}));

const Profile = () => {
  const user = {
    username: 'sathvik',
    email: 'srunusus@gmail.com',
    joinDate: 'Joined 2024',
    stats: {
      totalItems: 15,
      favorites: 5,
      outfitsGenerated: 8,
    },
  };

  return (
    <StyledContainer>
      <ContentContainer>
        <ProfileCard>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledAvatar>{user.username[0].toUpperCase()}</StyledAvatar>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
              {user.username}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              '& > div': {
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.9rem',
              }
            }}>
              <Box>{user.email}</Box>
              <Box>{user.joinDate}</Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Wardrobe Statistics
            </Typography>

            <StatBox>
              <Box>
                <StatIcon>👕</StatIcon>
                <Typography variant="h6">{user.stats.totalItems}</Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Total Items
                </Typography>
              </Box>
              <Box>
                <StatIcon>❤️</StatIcon>
                <Typography variant="h6">{user.stats.favorites}</Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Favorites
                </Typography>
              </Box>
              <Box>
                <StatIcon>👔</StatIcon>
                <Typography variant="h6">{user.stats.outfitsGenerated}</Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Outfits Generated
                </Typography>
              </Box>
            </StatBox>
          </Box>

          <EditButton>
            <EditIcon />
          </EditButton>
        </ProfileCard>
      </ContentContainer>
    </StyledContainer>
  );
};

export default Profile; 