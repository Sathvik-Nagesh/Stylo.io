"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const outfitController_1 = require("../controllers/outfitController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
const createOutfitValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    (0, express_validator_1.body)('items')
        .isArray({ min: 1 })
        .withMessage('Outfit must have at least one item'),
    (0, express_validator_1.body)('occasion')
        .notEmpty()
        .withMessage('Occasion is required')
        .isLength({ max: 50 })
        .withMessage('Occasion cannot exceed 50 characters'),
    (0, express_validator_1.body)('season')
        .optional()
        .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
        .withMessage('Invalid season'),
    (0, express_validator_1.body)('style')
        .optional()
        .isArray()
        .withMessage('Style must be an array'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];
const updateOutfitValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    (0, express_validator_1.body)('items')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Outfit must have at least one item'),
    (0, express_validator_1.body)('occasion')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Occasion cannot exceed 50 characters'),
    (0, express_validator_1.body)('season')
        .optional()
        .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
        .withMessage('Invalid season'),
    (0, express_validator_1.body)('style')
        .optional()
        .isArray()
        .withMessage('Style must be an array'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
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
    (0, express_validator_1.query)('occasion')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Occasion cannot exceed 50 characters'),
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
const generateOutfitValidation = [
    (0, express_validator_1.body)('occasion')
        .notEmpty()
        .withMessage('Occasion is required')
        .isLength({ max: 50 })
        .withMessage('Occasion cannot exceed 50 characters'),
    (0, express_validator_1.body)('season')
        .optional()
        .isIn(['spring', 'summer', 'fall', 'winter', 'all'])
        .withMessage('Invalid season'),
    (0, express_validator_1.body)('style')
        .optional()
        .isArray()
        .withMessage('Style must be an array'),
    (0, express_validator_1.body)('excludeItems')
        .optional()
        .isArray()
        .withMessage('Exclude items must be an array')
];
router.get('/', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(searchValidation), outfitController_1.getOutfits);
router.get('/search', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(searchValidation), outfitController_1.searchOutfits);
router.get('/stats', auth_1.authenticate, outfitController_1.getOutfitStats);
router.get('/generate', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(generateOutfitValidation), outfitController_1.generateOutfit);
router.get('/:id', auth_1.authenticate, outfitController_1.getOutfit);
router.post('/', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(createOutfitValidation), outfitController_1.createOutfit);
router.put('/:id', auth_1.authenticate, validation_1.sanitizeInput, (0, validation_1.validate)(updateOutfitValidation), outfitController_1.updateOutfit);
router.delete('/:id', auth_1.authenticate, outfitController_1.deleteOutfit);
exports.default = router;
