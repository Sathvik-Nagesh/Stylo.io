import express from 'express';
import { body, query } from 'express-validator';
import { 
  getClothingItems, 
  getClothingItem, 
  createClothingItem, 
  updateClothingItem, 
  deleteClothingItem,
  searchClothingItems,
  getClothingStats
} from '../controllers/clothingController';
import { authenticate } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';

const router = express.Router();

// Validation rules
const createClothingValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('type')
    .isIn(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'])
    .withMessage('Invalid clothing type'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('color')
    .notEmpty()
    .withMessage('Color is required')
    .isLength({ max: 30 })
    .withMessage('Color cannot exceed 30 characters'),
  body('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
    .withMessage('Invalid season'),
  body('style')
    .optional()
    .isArray()
    .withMessage('Style must be an array'),
  body('brand')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Brand cannot exceed 50 characters'),
  body('size')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Size cannot exceed 20 characters'),
  body('material')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Material cannot exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateClothingValidation = [
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('type')
    .optional()
    .isIn(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'])
    .withMessage('Invalid clothing type'),
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('color')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Color cannot exceed 30 characters'),
  body('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
    .withMessage('Invalid season'),
  body('style')
    .optional()
    .isArray()
    .withMessage('Style must be an array'),
  body('brand')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Brand cannot exceed 50 characters'),
  body('size')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Size cannot exceed 20 characters'),
  body('material')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Material cannot exceed 50 characters'),
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
  query('type')
    .optional()
    .isIn(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'])
    .withMessage('Invalid clothing type'),
  query('color')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Color cannot exceed 30 characters'),
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

// Routes
router.get('/', authenticate, sanitizeInput, validate(searchValidation), getClothingItems);
router.get('/search', authenticate, sanitizeInput, validate(searchValidation), searchClothingItems);
router.get('/stats', authenticate, getClothingStats);
router.get('/:id', authenticate, getClothingItem);
router.post('/', authenticate, sanitizeInput, validate(createClothingValidation), createClothingItem);
router.put('/:id', authenticate, sanitizeInput, validate(updateClothingValidation), updateClothingItem);
router.delete('/:id', authenticate, deleteClothingItem);

export default router;
