import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Fade,
  Paper,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useNavigate } from 'react-router-dom';
import ClothingItem from '../components/ClothingItem';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 25,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  alignItems: 'center',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

const EmptyState = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  marginTop: theme.spacing(4),
}));

interface ClothingItem {
  _id: string;
  name: string;
  type: string;
  color: string;
  season: string;
  style: string;
  imageUrl: string;
}

const Wardrobe: React.FC = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All items');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const filterOptions = [
    'All items',
    'Tops',
    'Bottoms',
    'Dresses',
    'Outerwear',
    'Shoes',
    'Accessories'
  ];

  useEffect(() => {
    fetchItems();
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items');
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All items' || item.type.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <Header>
        <Typography variant="h4" component="h1" sx={{ 
          background: 'linear-gradient(45deg, #6B46C1, #B794F4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold'
        }}>
          My Wardrobe
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ActionButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/upload')}
          >
            Add Item
          </ActionButton>
          <ActionButton
            variant="contained"
            color="secondary"
            startIcon={<AutorenewIcon />}
            onClick={() => navigate('/generate')}
          >
            Generate Outfit
          </ActionButton>
        </Box>
      </Header>

      <SearchBar
        fullWidth
        variant="outlined"
        placeholder="Search items by name, type, or color..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <FilterSection>
        {filterOptions.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            onClick={() => setActiveFilter(filter)}
            color={activeFilter === filter ? 'primary' : 'default'}
            variant={activeFilter === filter ? 'filled' : 'outlined'}
            sx={{
              borderRadius: '16px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          />
        ))}
      </FilterSection>

      {filteredItems.length === 0 ? (
        <Fade in>
          <EmptyState>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No items found
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {items.length === 0 
                ? "Your wardrobe is empty. Start by adding some items!"
                : "No items match your current filters. Try adjusting your search or filters."}
            </Typography>
            {items.length === 0 && (
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/upload')}
                sx={{ mt: 2 }}
              >
                Add Your First Item
              </ActionButton>
            )}
          </EmptyState>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Fade in timeout={500}>
                <Box>
                  <ClothingItem
                    item={item}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(item._id)}
                  />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </StyledContainer>
  );
};

export default Wardrobe; 