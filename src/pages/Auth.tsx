import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  styled,
  IconButton,
  Snackbar,
  Alert,
  Container as MuiContainer,
} from '@mui/material';
import { Google, Facebook, GitHub, LinkedIn, Person, Lock, Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const StyledContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%)',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
    animation: 'float 15s linear infinite',
  },
  '@keyframes float': {
    '0%': {
      transform: 'translate(-50%, -50%) rotate(0deg) scale(1)',
    },
    '50%': {
      transform: 'translate(-50%, -50%) rotate(180deg) scale(1.1)',
    },
    '100%': {
      transform: 'translate(-50%, -50%) rotate(360deg) scale(1)',
    },
  },
});

const AuthCard = styled(MuiContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '40px',
  maxWidth: '450px !important',
  width: '100%',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '20px',
    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'transform 0.6s ease',
    zIndex: -1,
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(31, 38, 135, 0.25)',
    '&::before': {
      transform: 'rotate(180deg)',
    },
  },
}));

const Title = styled('h1')({
  fontSize: '32px',
  color: '#fff',
  textAlign: 'center',
  marginBottom: '30px',
  fontWeight: 600,
  position: 'relative',
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    width: '40px',
    height: '2px',
    background: 'rgba(255, 255, 255, 0.5)',
    transform: 'translateX(-50%)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
  },
});

const FormWrapper = styled('div')<{ $isSignUp: boolean }>(({ $isSignUp }) => ({
  position: 'relative',
  width: '100%',
  perspective: '2000px',
  '& > form': {
    backfaceVisibility: 'hidden',
    transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    transform: $isSignUp ? 'rotateY(180deg) translateZ(100px)' : 'rotateY(0) translateZ(0)',
    opacity: $isSignUp ? 0 : 1,
    position: $isSignUp ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    width: '100%',
    transformStyle: 'preserve-3d',
  },
  '& > form:last-child': {
    position: $isSignUp ? 'relative' : 'absolute',
    transform: $isSignUp ? 'rotateY(0) translateZ(0)' : 'rotateY(-180deg) translateZ(100px)',
    opacity: $isSignUp ? 1 : 0,
  },
}));

const InputBox = styled('div')({
  position: 'relative',
  margin: '20px 0',
  width: '100%',
  '& input': {
    width: '100%',
    padding: '15px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    outline: 'none',
    fontSize: '16px',
    color: '#fff',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    backdropFilter: 'blur(5px)',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)',
      transition: 'all 0.3s ease',
    },
    '&:focus': {
      background: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.02)',
      '&::placeholder': {
        opacity: 0,
        transform: 'translateX(-10px)',
      },
    },
  },
});

const IconWrapper = styled('div')({
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(255, 255, 255, 0.6)',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '& svg': {
    transition: 'transform 0.3s ease',
    filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2))',
  },
  'input:focus ~ &': {
    color: 'rgba(255, 255, 255, 0.9)',
    '& svg': {
      transform: 'scale(1.1)',
    },
  },
});

const StyledButton = styled(Button)({
  width: '100%',
  padding: '12px',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  marginTop: '20px',
  backdropFilter: 'blur(5px)',
  transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease',
  },
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    '&::before': {
      transform: 'translateX(100%)',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

const ToggleText = styled('p')({
  color: 'rgba(255, 255, 255, 0.8)',
  textAlign: 'center',
  marginTop: '20px',
  transition: 'all 0.3s ease',
  '& span': {
    color: '#fff',
    cursor: 'pointer',
    position: 'relative',
    padding: '0 4px',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: -2,
      left: 0,
      width: '100%',
      height: '1px',
      background: 'rgba(255, 255, 255, 0.5)',
      transform: 'scaleX(0)',
      transformOrigin: 'right',
      transition: 'transform 0.3s ease',
    },
    '&:hover': {
      textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      '&::before': {
        transform: 'scaleX(1)',
        transformOrigin: 'left',
      },
    },
  },
});

const ErrorText = styled(Typography)({
  color: 'rgba(255, 99, 99, 0.9)',
  fontSize: '12px',
  marginTop: '5px',
  position: 'absolute',
  textShadow: '0 0 10px rgba(255, 99, 99, 0.3)',
});

interface FormData {
  email: string;
  password: string;
  username?: string;
}

interface FormError {
  email?: string;
  password?: string;
  username?: string;
  general?: string;
}

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: '',
  });
  const [errors, setErrors] = useState<FormError>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    const newErrors: FormError = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignUp && !formData.username) {
      newErrors.username = 'Username is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      setAlert({
        open: true,
        message: isSignUp ? 'Registration successful!' : 'Login successful!',
        severity: 'success',
      });
      
      // Use the login function from AuthContext
      login(response.data.token, response.data.user);
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      setAlert({
        open: true,
        message,
        severity: 'error',
      });
      setErrors({
        ...errors,
        general: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name as keyof FormError]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <StyledContainer>
      <AuthCard>
        <Title>{isSignUp ? 'Create Account' : 'Welcome Back!'}</Title>
        <FormWrapper $isSignUp={isSignUp}>
          <form onSubmit={handleSubmit}>
            <InputBox>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <IconWrapper>
                <Email />
              </IconWrapper>
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </InputBox>
            <InputBox>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <IconWrapper>
                <Lock />
                <IconButton
                  onClick={handleTogglePassword}
                  sx={{ color: 'rgba(255, 255, 255, 0.6)', padding: '4px', marginLeft: '4px' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </IconWrapper>
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </InputBox>
            <StyledButton type="submit" disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </StyledButton>
          </form>

          <form onSubmit={handleSubmit}>
            <InputBox>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <IconWrapper>
                <Person />
              </IconWrapper>
              {errors.username && <ErrorText>{errors.username}</ErrorText>}
            </InputBox>
            <InputBox>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <IconWrapper>
                <Email />
              </IconWrapper>
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </InputBox>
            <InputBox>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <IconWrapper>
                <Lock />
                <IconButton
                  onClick={handleTogglePassword}
                  sx={{ color: 'rgba(255, 255, 255, 0.6)', padding: '4px', marginLeft: '4px' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </IconWrapper>
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </InputBox>
            <StyledButton type="submit" disabled={loading}>
              {loading ? 'Please wait...' : 'Sign Up'}
            </StyledButton>
          </form>
        </FormWrapper>

        <ToggleText>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </span>
        </ToggleText>
      </AuthCard>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{
            width: '100%',
            background: alert.severity === 'success' ? 'rgba(46, 125, 50, 0.9)' : 'rgba(211, 47, 47, 0.9)',
            color: '#fff',
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Auth; 