import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Fade,
  Zoom,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ClothingType, 
  StyleType, 
  SeasonType, 
  COLORS, 
  ColorType,
  CLOTHING_TYPES,
  STYLE_TYPES,
  SEASON_TYPES
} from '../types/ClothingTypes';
import { motion } from 'framer-motion';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  maxWidth: '100% !important',
  padding: '0 !important',
  margin: 0,
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
}));

const UploadBox = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(45, 27, 105, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '30px',
  padding: theme.spacing(8),
  width: '100%',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6384dc',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const DropZone = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: '2px dashed rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  height: '500px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(4),
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#6384dc',
    background: 'rgba(99, 132, 220, 0.1)',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
  color: '#fff',
  padding: '12px 32px',
  borderRadius: '12px',
  '&:hover': {
    background: 'linear-gradient(45deg, #7494ec 30%, #85a4fc 90%)',
    transform: 'translateY(-2px)',
  },
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  borderRadius: '16px',
  border: '1px solid rgba(99, 132, 220, 0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.4), rgba(55, 59, 68, 0.4))',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    border: '1px solid rgba(99, 132, 220, 0.3)',
    transform: 'translateY(-2px)',
  },
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
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

const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  '& .MuiFormControl-root': {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.4), rgba(55, 59, 68, 0.4))',
      borderRadius: '12px',
      border: '1px solid rgba(99, 132, 220, 0.2)',
      transition: 'all 0.3s ease',
      '&:hover': {
        border: '1px solid rgba(99, 132, 220, 0.3)',
      },
      '&.Mui-focused': {
        border: '1px solid rgba(99, 132, 220, 0.4)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(99, 132, 220, 0.15), rgba(116, 148, 236, 0.15))',
  border: '1px solid rgba(99, 132, 220, 0.2)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(145deg, rgba(99, 132, 220, 0.25), rgba(116, 148, 236, 0.25))',
  },
}));

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #6384dc 30%, #7494ec 90%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  marginBottom: '2rem',
});

interface DetectedInfo {
  name: string;
  type: ClothingType;
  color: ColorType;
  style: StyleType;
  season: SeasonType;
}

interface Progress {
  upload: boolean;
  download: boolean;
  progress: number;
}

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<Progress>({ upload: false, download: false, progress: 0 });
  const [selectedType, setSelectedType] = useState<ClothingType>('top');
  const [detectedInfo, setDetectedInfo] = useState<DetectedInfo | null>(null);
  const [editedInfo, setEditedInfo] = useState<DetectedInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setProgress({ upload: true, download: false, progress: 0 });
    setError(null);

    try {
      const imageData = new FormData();
      imageData.append('image', file);
      imageData.append('type', selectedType);
      
      // First, get the background removed preview
      const previewResponse = await axios.post(
        'http://localhost:5000/api/items/preview',
        imageData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total 
              ? progressEvent.loaded / progressEvent.total 
              : 0;
            setProgress(prev => ({ ...prev, upload: true, progress }));
          },
          responseType: 'blob'
        }
      );

      // Update preview with background removed image
      setPreview(URL.createObjectURL(previewResponse.data));

      // Now detect clothing attributes
      const detectionResponse = await axios.post(
        'http://localhost:5000/api/items/detect-clothing',
        imageData,
        {
          onDownloadProgress: (progressEvent) => {
            const progress = progressEvent.total 
              ? progressEvent.loaded / progressEvent.total 
              : 0;
            setProgress(prev => ({ ...prev, download: true, progress }));
          }
        }
      );

      if (detectionResponse.data && detectionResponse.data.type) {
        setDetectedInfo(detectionResponse.data);
        setEditedInfo(detectionResponse.data);
      } else {
        throw new Error('Invalid detection response');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
      setProgress({ upload: false, download: false, progress: 0 });
    }
  }, [selectedType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !editedInfo) return;

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', editedInfo.type);
      formData.append('name', editedInfo.name);
      formData.append('color', editedInfo.color);
      formData.append('style', editedInfo.style);
      formData.append('season', editedInfo.season);

      await axios.post('http://localhost:5000/api/items', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error uploading item:', error);
      setError('Failed to upload item. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleInfoChange = (field: keyof DetectedInfo, value: string) => {
    if (!editedInfo) return;
    setEditedInfo({
      ...editedInfo,
      [field]: value
    });
  };

  // When detectedInfo changes, update editedInfo
  React.useEffect(() => {
    if (detectedInfo) {
      setEditedInfo(detectedInfo);
    }
  }, [detectedInfo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  return (
    <StyledContainer>
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 600 }}
        >
          <UploadBox>
            <Title variant="h4" gutterBottom>
              Upload Item
            </Title>
            
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

            {success && (
              <Alert 
                severity="success"
                sx={{ 
                  width: '100%',
                  background: 'rgba(46, 125, 50, 0.1)',
                  border: '1px solid rgba(46, 125, 50, 0.3)',
                  color: '#69db7c',
                }}
              >
                Item added successfully!
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <FormSection>
                <FormControl fullWidth>
                  <InputLabel>Select Item Type</InputLabel>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ClothingType)}
                    label="Select Item Type"
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
                    sx={{
                      color: '#fff',
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    {CLOTHING_TYPES.map((type) => (
                      <MenuItem 
                        key={type} 
                        value={type}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <DropZone
                  {...getRootProps()}
                  component={ImagePreview}
                  sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    ...(isDragActive && {
                      border: '2px dashed rgba(99, 132, 220, 0.5)',
                      background: 'linear-gradient(145deg, rgba(45, 49, 58, 0.6), rgba(55, 59, 68, 0.6))',
                    }),
                  }}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview('');
                          setFile(null);
                          setDetectedInfo(null);
                          setEditedInfo(null);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(211, 47, 47, 0.1)',
                          border: '1px solid rgba(211, 47, 47, 0.3)',
                          color: '#ff6b6b',
                          '&:hover': {
                            background: 'rgba(211, 47, 47, 0.2)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <Box sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Typography 
                        color="textSecondary"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '1rem'
                        }}
                      >
                        Drag and drop an image here, or click to select
                      </Typography>
                    </Box>
                  )}
                  {(loading || processing) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '16px',
                      }}
                    >
                      <CircularProgress 
                        variant={progress.upload || progress.download ? "determinate" : "indeterminate"}
                        value={progress.progress * 100}
                        sx={{ color: '#6384dc' }}
                      />
                    </Box>
                  )}
                </DropZone>

                {detectedInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#fff',
                          textAlign: 'center',
                          mb: 1,
                        }}
                      >
                        Detected Information
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                        <StyledChip label={`Type: ${detectedInfo.type}`} />
                        <StyledChip label={`Color: ${detectedInfo.color}`} />
                        <StyledChip label={`Style: ${detectedInfo.style}`} />
                        <StyledChip label={`Season: ${detectedInfo.season}`} />
                      </Stack>
                    </Stack>
                  </motion.div>
                )}

                {editedInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Stack spacing={3}>
                      <TextField
                        label="Item Name"
                        value={editedInfo.name}
                        onChange={(e) => handleInfoChange('name', e.target.value)}
                        fullWidth
                      />
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={editedInfo.type}
                          onChange={(e) => handleInfoChange('type', e.target.value)}
                          label="Type"
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
                          {CLOTHING_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Color</InputLabel>
                        <Select
                          value={editedInfo.color}
                          onChange={(e) => handleInfoChange('color', e.target.value)}
                          label="Color"
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
                          {COLORS.map((color) => (
                            <MenuItem key={color} value={color}>
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Style</InputLabel>
                        <Select
                          value={editedInfo.style}
                          onChange={(e) => handleInfoChange('style', e.target.value)}
                          label="Style"
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
                          {STYLE_TYPES.map((style) => (
                            <MenuItem key={style} value={style}>
                              {style.charAt(0).toUpperCase() + style.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Season</InputLabel>
                        <Select
                          value={editedInfo.season}
                          onChange={(e) => handleInfoChange('season', e.target.value)}
                          label="Season"
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
                          {SEASON_TYPES.map((season) => (
                            <MenuItem key={season} value={season}>
                              {season.charAt(0).toUpperCase() + season.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <SubmitButton
                          variant="contained"
                          type="submit"
                          disabled={processing}
                        >
                          Upload Item
                        </SubmitButton>
                      </Box>
                    </Stack>
                  </motion.div>
                )}
                </FormSection>
              </form>
            </UploadBox>
          </motion.div>
        </ContentContainer>
      </StyledContainer>
    );
  };

  export default Upload; 