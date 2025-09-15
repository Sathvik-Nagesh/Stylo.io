"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Outfit = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OutfitSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Outfit name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    items: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Clothing',
            required: true
        }],
    occasion: {
        type: String,
        required: [true, 'Occasion is required'],
        trim: true,
        maxlength: [50, 'Occasion cannot exceed 50 characters']
    },
    season: {
        type: String,
        required: [true, 'Season is required'],
        enum: ['spring', 'summer', 'fall', 'winter', 'all'],
        default: 'all'
    },
    style: [{
            type: String,
            enum: ['casual', 'formal', 'sporty', 'vintage', 'modern', 'bohemian', 'minimalist', 'elegant', 'edgy', 'romantic']
        }],
    tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot exceed 30 characters']
        }],
    isFavorite: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    lastWorn: {
        type: Date
    },
    wearCount: {
        type: Number,
        default: 0,
        min: [0, 'Wear count cannot be negative']
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
});
OutfitSchema.index({ user: 1, occasion: 1 });
OutfitSchema.index({ user: 1, season: 1 });
OutfitSchema.index({ user: 1, isFavorite: 1 });
OutfitSchema.index({ user: 1, createdAt: -1 });
OutfitSchema.index({ user: 1, rating: -1 });
OutfitSchema.index({
    name: 'text',
    description: 'text',
    occasion: 'text',
    tags: 'text'
});
OutfitSchema.pre('save', function (next) {
    if (this.items.length === 0) {
        next(new Error('Outfit must have at least one clothing item'));
    }
    else {
        next();
    }
});
exports.Outfit = mongoose_1.default.model('Outfit', OutfitSchema);
