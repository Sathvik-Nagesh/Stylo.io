import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  useTheme,
  styled,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AccountCircle as AccountIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(26, 26, 41, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.85)',
  position: 'relative',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  fontSize: '15px',
  letterSpacing: '0.3px',
  '&.active': {
    color: '#fff',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
    '&::before': {
      opacity: 1,
      transform: 'translateY(0)',
      background: 'rgba(255, 255, 255, 0.15)',
    },
    '&::after': {
      width: '100%',
      opacity: 1,
      height: '3px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.3) 100%)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    opacity: 0,
    transform: 'translateY(5px)',
    transition: 'all 0.3s ease',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: 0,
    height: '2px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.2) 100%)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
    opacity: 0,
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    color: '#fff',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
    '&::before': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '&::after': {
      width: '100%',
      opacity: 1,
    },
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontSize: '26px',
  fontWeight: 700,
  color: '#fff',
  textDecoration: 'none',
  textShadow: '0 0 15px rgba(255, 255, 255, 0.4)',
  letterSpacing: '0.5px',
  '& span': {
    background: 'linear-gradient(45deg, #fff 20%, rgba(255, 255, 255, 0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: 'none',
  },
}));

const MotionBox = styled(motion.div)({
  display: 'flex',
  gap: '24px',
});

const StyledMenu = styled(Menu)({
  '& .MuiPaper-root': {
    background: 'rgba(26, 26, 41, 0.98)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
    color: '#fff',
    overflow: 'hidden',
    minWidth: '200px',
  },
  '& .MuiMenuItem-root': {
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    padding: '12px 24px',
    fontSize: '14px',
    letterSpacing: '0.3px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      color: '#fff',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
    },
    '& .MuiSvgIcon-root': {
      color: 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease',
      fontSize: '20px',
    },
    '&:hover .MuiSvgIcon-root': {
      color: '#fff',
      filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
    },
  },
  '& .MuiDivider-root': {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    margin: '8px 0',
  },
});

const StyledAvatar = styled(Avatar)({
  background: 'rgba(255, 255, 255, 0.15)',
  border: '2px solid rgba(255, 255, 255, 0.25)',
  transition: 'all 0.3s ease',
  width: '40px',
  height: '40px',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
  },
});

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    navigate('/auth', { replace: true });
    setTimeout(() => {
      logout();
    }, 0);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  if (location.pathname === '/auth') {
    return null;
  }

  if (!isAuthenticated && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Logo variant="h6">
              Stylo<span>.</span>
            </Logo>
          </motion.div>
        </RouterLink>
        {isAuthenticated && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <MotionBox
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <RouterLink to="/" style={{ textDecoration: 'none' }}>
                <NavButton className={isActive('/') ? 'active' : ''}>
                  My Wardrobe
                </NavButton>
              </RouterLink>
              <RouterLink to="/upload" style={{ textDecoration: 'none' }}>
                <NavButton className={isActive('/upload') ? 'active' : ''}>
                  Upload
                </NavButton>
              </RouterLink>
              <RouterLink to="/generate" style={{ textDecoration: 'none' }}>
                <NavButton className={isActive('/generate') ? 'active' : ''}>
                  Generate Outfit
                </NavButton>
              </RouterLink>
            </MotionBox>
          </Box>
        )}
        {isAuthenticated && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <IconButton
              onClick={handleMenu}
              sx={{
                padding: 0,
                '&:hover': {
                  background: 'none',
                },
              }}
            >
              <StyledAvatar>
                <Typography variant="body1" sx={{ color: '#fff' }}>U</Typography>
              </StyledAvatar>
            </IconButton>
            <StyledMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfile} sx={{ gap: 1.5 }}>
                <AccountIcon fontSize="small" />
                View Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5 }}>
                <LogoutIcon fontSize="small" />
                Logout
              </MenuItem>
            </StyledMenu>
          </motion.div>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 