import express from 'express';
import { body, query } from 'express-validator';
import { 
  getOutfits, 
  getOutfit, 
  createOutfit, 
  updateOutfit, 
  deleteOutfit,
  searchOutfits,
  getOutfitStats,
  generateOutfit
} from '../controllers/outfitController';
import { authenticate } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';

const router = express.Router();

// Validation rules
const createOutfitValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Outfit must have at least one item'),
  body('occasion')
    .notEmpty()
    .withMessage('Occasion is required')
    .isLength({ max: 50 })
    .withMessage('Occasion cannot exceed 50 characters'),
  body('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
    .withMessage('Invalid season'),
  body('style')
    .optional()
    .isArray()
    .withMessage('Style must be an array'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateOutfitValidation = [
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Outfit must have at least one item'),
  body('occasion')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Occasion cannot exceed 50 characters'),
  body('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
    .withMessage('Invalid season'),
  body('style')
    .optional()
    .isArray()
    .withMessage('Style must be an array'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const searchValidation = [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('occasion')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Occasion cannot exceed 50 characters'),
  query('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
    .withMessage('Invalid season'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const generateOutfitValidation = [
  body('occasion')
    .notEmpty()
    .withMessage('Occasion is required')
    .isLength({ max: 50 })
    .withMessage('Occasion cannot exceed 50 characters'),
  body('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
    .withMessage('Invalid season'),
  body('style')
    .optional()
    .isArray()
    .withMessage('Style must be an array'),
  body('excludeItems')
    .optional()
    .isArray()
    .withMessage('Exclude items must be an array')
];

// Routes
router.get('/', authenticate, sanitizeInput, validate(searchValidation), getOutfits);
router.get('/search', authenticate, sanitizeInput, validate(searchValidation), searchOutfits);
router.get('/stats', authenticate, getOutfitStats);
router.get('/generate', authenticate, sanitizeInput, validate(generateOutfitValidation), generateOutfit);
router.get('/:id', authenticate, getOutfit);
router.post('/', authenticate, sanitizeInput, validate(createOutfitValidation), createOutfit);
router.put('/:id', authenticate, sanitizeInput, validate(updateOutfitValidation), updateOutfit);
router.delete('/:id', authenticate, deleteOutfit);

export default router;
