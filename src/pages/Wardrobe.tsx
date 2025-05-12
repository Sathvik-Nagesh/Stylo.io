import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  Fade,
  Collapse,
  useTheme,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Container,
  Paper,
  CircularProgress,
  Fab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Add as AddIcon, 
  AutoFixHigh as MagicIcon, 
  Delete as DeleteIcon, 
  Favorite, 
  FavoriteBorder,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Star as StarIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

interface ClothingItem {
  _id: string;
  name: string;
  type: string;
  imageUrl: string;
  color: string;
  season: string;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  maxWidth: '100% !important',
  padding: '0 !important',
  margin: 0,
  paddingTop: '64px',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%)',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '1600px',
  margin: '0 auto',
}));

const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  borderRadius: '30px',
  padding: '16px 32px',
  background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
  color: '#fff',
  boxShadow: '0 8px 32px rgba(99, 132, 220, 0.4)',
  transition: 'all 0.3s ease-in-out',
  zIndex: 1000,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(99, 132, 220, 0.6)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    marginRight: theme.spacing(1),
  },
}));

const ItemCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(45, 27, 105, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)',
  backdropFilter: 'blur(5px)',
  borderRadius: '15px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  },
}));

const ItemImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '8px 8px 0 0',
});

const ItemInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: '#ffffff',
}));

const ChipContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: '#ffffff',
  background: 'rgba(0, 0, 0, 0.3)',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.5)',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  color: '#ffffff',
}));

const AddButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  background: 'linear-gradient(135deg, #2d1b69 0%, #1a1a1a 100%)',
  color: '#ffffff',
  '&:hover': {
    background: 'linear-gradient(135deg, #3d2b79 0%, #2a2a2a 100%)',
  },
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2d1b69',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  marginBottom: theme.spacing(3),
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'linear-gradient(135deg, #2d1b69 0%, #1a1a1a 100%)',
  color: '#ffffff',
  '&:hover': {
    background: 'linear-gradient(135deg, #3d2b79 0%, #2a2a2a 100%)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6384dc 0%, #7494ec 100%)',
  color: '#fff',
  borderRadius: '12px',
  padding: '10px 24px',
  border: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'rgba(26, 32, 44, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      borderColor: '#6384dc',
      transform: 'scale(1.02)',
    },
    '&.Mui-focused': {
      borderColor: '#6384dc',
      boxShadow: '0 0 0 2px rgba(99, 132, 220, 0.2)',
      background: 'rgba(45, 55, 72, 0.8)',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  '& .MuiSvgIcon-root': {
    color: '#6384dc',
  },
}));

const categories = ['All Items', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'rgba(26, 32, 44, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  '& .MuiMenuItem-root': {
    color: '#fff',
    '&:hover': {
      background: 'rgba(99, 132, 220, 0.2)',
    },
  },
}));

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const WelcomeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  transition: 'all 0.5s ease-in-out',
}));

const WelcomeMessage = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  color: '#fff',
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease-in-out',
  transform: 'scale(1)',
  '& span': {
    fontWeight: 700,
    background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textShadow: 'none',
  },
}));

const SubWelcome = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: 'rgba(255, 255, 255, 0.7)',
  marginBottom: theme.spacing(4),
  fontWeight: 400,
}));

const Wardrobe = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClothingItem | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'name' | 'color' | 'type'>('name');
  const [filterSeason, setFilterSeason] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        setItems(response.data);
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Show welcome message for 20 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteClick = (item: ClothingItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/items/${itemToDelete._id}`);
      setItems(items.filter(item => item._id !== itemToDelete._id));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
    // Convert Set to Array before saving to localStorage
    const favoritesArray = Array.from(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
  };

  const filteredItems = activeCategory === 'All Items'
    ? items
    : items.filter(item => item.type.toLowerCase() === activeCategory.toLowerCase().slice(0, -1));

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClose = (sort?: 'name' | 'color' | 'type') => {
    setSortAnchorEl(null);
    if (sort) {
      setSortBy(sort);
    }
  };

  const handleFilterClose = (season?: string) => {
    setFilterAnchorEl(null);
    if (season) {
      setFilterSeason(season === filterSeason ? null : season);
    }
  };

  const sortedAndFilteredItems = filteredItems
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(item => !filterSeason || item.season === filterSeason)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'color') return a.color.localeCompare(b.color);
      return a.type.localeCompare(b.type);
    });

  const favoriteCount = Array.from(favorites).length;

  return (
    <StyledContainer>
      <ContentContainer>
        <Collapse in={showWelcome} timeout={500}>
          <WelcomeContainer>
            <Zoom in={showWelcome} timeout={800}>
              <Box>
                <WelcomeMessage>
                  Welcome back, <span>{user?.username ? capitalizeFirstLetter(user.username) : 'Guest'}</span>!
                </WelcomeMessage>
                <SubWelcome>
                  {items.length > 0 
                    ? `You have ${items.length} items in your wardrobe. Let's create something amazing!`
                    : "Your wardrobe is empty. Let's add some items to get started!"}
                </SubWelcome>
              </Box>
            </Zoom>
          </WelcomeContainer>
        </Collapse>

        <Fade in timeout={800}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
              My Wardrobe
            </Typography>
            <Stack direction="row" spacing={2}>
              <StyledButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/upload')}
              >
                Add Item
              </StyledButton>
            </Stack>
          </Box>
        </Fade>

        <Fade in timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <SearchInput
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Tooltip title="Sort items">
                <IconButton onClick={handleSortClick}>
                  <SortIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter by season">
                <IconButton onClick={handleFilterClick}>
                  <Badge 
                    color="primary" 
                    variant="dot" 
                    invisible={!filterSeason}
                  >
                    <FilterIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Favorite items">
                <Badge 
                  badgeContent={favoriteCount} 
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem' } }}
                >
                  <Chip
                    icon={<StarIcon />}
                    label="Favorites"
                    onClick={() => setActiveCategory('Favorites')}
                    color={activeCategory === 'Favorites' ? 'primary' : 'default'}
                  />
                </Badge>
              </Tooltip>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: 'auto',
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-track': { backgroundColor: 'background.paper' },
                '&::-webkit-scrollbar-thumb': { 
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 3,
                },
              }}
            >
              {categories.map((category, index) => (
                <Zoom in key={category} style={{ transitionDelay: `${index * 100}ms` }}>
                  <CategoryChip
                    label={category}
                    onClick={() => setActiveCategory(category)}
                    className={activeCategory === category ? 'active' : ''}
                    icon={<TagIcon />}
                  />
                </Zoom>
              ))}
            </Stack>
          </Box>
        </Fade>

        {sortedAndFilteredItems.length === 0 ? (
          <Fade in timeout={1200}>
            <EmptyState>
              <MagicIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No items in this category yet
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Start building your wardrobe by adding some items
              </Typography>
              <StyledButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/upload')}
                sx={{ mt: 2 }}
              >
                Add Your First Item
              </StyledButton>
            </EmptyState>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {sortedAndFilteredItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                  <ItemCard>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`http://localhost:5000${item.imageUrl}`}
                        alt={item.name}
                        sx={{ 
                          objectFit: 'contain',
                          bgcolor: 'white',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                      <Box sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                      }}>
                        <IconButton
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 1)',
                            },
                          }}
                          onClick={() => toggleFavorite(item._id)}
                        >
                          {favorites.has(item._id) ? (
                            <Favorite sx={{ color: theme.palette.error.main }} />
                          ) : (
                            <FavoriteBorder sx={{ color: theme.palette.error.main }} />
                          )}
                        </IconButton>
                        <IconButton
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 1)',
                            },
                          }}
                          onClick={() => handleDeleteClick(item)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {item.name}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <CategoryChip
                          label={item.type}
                          size="small"
                        />
                        <CategoryChip
                          label={item.color}
                          size="small"
                        />
                        <CategoryChip
                          label={item.season}
                          size="small"
                        />
                      </Stack>
                    </CardContent>
                  </ItemCard>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}

        <StyledMenu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => handleSortClose()}
        >
          <MenuItem onClick={() => handleSortClose('name')}>Sort by Name</MenuItem>
          <MenuItem onClick={() => handleSortClose('color')}>Sort by Color</MenuItem>
          <MenuItem onClick={() => handleSortClose('type')}>Sort by Type</MenuItem>
        </StyledMenu>

        <StyledMenu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => handleFilterClose()}
        >
          <MenuItem onClick={() => handleFilterClose('Spring')}>Spring</MenuItem>
          <MenuItem onClick={() => handleFilterClose('Summer')}>Summer</MenuItem>
          <MenuItem onClick={() => handleFilterClose('Fall')}>Fall</MenuItem>
          <MenuItem onClick={() => handleFilterClose('Winter')}>Winter</MenuItem>
        </StyledMenu>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              background: 'rgba(26, 32, 44, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              color: '#fff',
            },
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this item?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} sx={{ color: '#6384dc' }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Zoom in timeout={1000}>
          <FloatingButton
            variant="contained"
            onClick={() => navigate('/generate')}
            startIcon={<MagicIcon />}
          >
            Generate Outfit
          </FloatingButton>
        </Zoom>
      </ContentContainer>
    </StyledContainer>
  );
};

export default Wardrobe; 