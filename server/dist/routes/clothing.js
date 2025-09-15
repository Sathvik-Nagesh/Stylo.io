"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const clothingController_1 = require("../controllers/clothingController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
const createClothingValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    (0, express_validator_1.body)('type')
        .isIn(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'])
        .withMessage('Invalid clothing type'),
    (0, express_validator_1.body)('category')
        .notEmpty()
        .withMessage('Category is required')
        .isLength({ max: 50 })
        .withMessage('Category cannot exceed 50 characters'),
    (0, express_validator_1.body)('color')
        .notEmpty()
        .withMessage('Color is required')
        .isLength({ max: 30 })
        .withMessage('Color cannot exceed 30 characters'),
    (0, express_validator_1.body)('season')
        .optional()
        .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
        .withMessage('Invalid season'),
    (0, express_validator_1.body)('style')
        .optional()
        .isArray()
        .withMessage('Style must be an array'),
    (0, express_validator_1.body)('brand')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Brand cannot exceed 50 characters'),
    (0, express_validator_1.body)('size')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Size cannot exceed 20 characters'),
    (0, express_validator_1.body)('material')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Material cannot exceed 50 characters'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];
const updateClothingValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'])
        .withMessage('Invalid clothing type'),
    (0, express_validator_1.body)('category')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Category cannot exceed 50 characters'),
    (0, express_validator_1.body)('color')
        .optional()
        .isLength({ max: 30 })
        .withMessage('Color cannot exceed 30 characters'),
    (0, express_validator_1.body)('season')
        .optional()
        .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
        .withMessage('Invalid season'),
    (0, express_validator_1.body)('style')
        .optional()
        .isArray()
        .withMessage('Style must be an array'),
    (0, express_validator_1.body)('brand')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Brand cannot exceed 50 characters'),
    (0, express_validator_1.body)('size')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Size cannot exceed 20 characters'),
    (0, express_validator_1.body)('material')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Material cannot exceed 50 characters'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];
const searchValidation = [
    (0, express_validator_1.query)('q')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'])
        .withMessage('Invalid clothing type'),
    (0, express_validator_1.query)('color')
        .optional()
        .isLength({ max: 30 })
        .withMessage('Color cannot exceed 30 characters'),
    (0, express_validator_1.query)('season')
        .optional()
        .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
        .withMessage('Invalid season'),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];
router.get('/', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(searchValidation), clothingController_1.getClothingItems);
router.get('/search', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(searchValidation), clothingController_1.searchClothingItems);
router.get('/stats', auth_1.authenticate, clothingController_1.getClothingStats);
router.get('/:id', auth_1.authenticate, clothingController_1.getClothingItem);
router.post('/', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(createClothingValidation), clothingController_1.createClothingItem);
router.put('/:id', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(updateClothingValidation), clothingController_1.updateClothingItem);
router.delete('/:id', auth_1.authenticate, clothingController_1.deleteClothingItem);
exports.default = router;
