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
exports.Clothing = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ClothingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Clothing name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    type: {
        type: String,
        required: [true, 'Clothing type is required'],
        enum: ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true,
        maxlength: [30, 'Color cannot exceed 30 characters']
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
    brand: {
        type: String,
        trim: true,
        maxlength: [50, 'Brand cannot exceed 50 characters']
    },
    size: {
        type: String,
        trim: true,
        maxlength: [20, 'Size cannot exceed 20 characters']
    },
    material: {
        type: String,
        trim: true,
        maxlength: [50, 'Material cannot exceed 50 characters']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    imagePath: {
        type: String,
        required: [true, 'Image path is required']
    },
    tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot exceed 30 characters']
        }],
    isFavorite: {
        type: Boolean,
        default: false
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
ClothingSchema.index({ user: 1, type: 1 });
ClothingSchema.index({ user: 1, color: 1 });
ClothingSchema.index({ user: 1, season: 1 });
ClothingSchema.index({ user: 1, isFavorite: 1 });
ClothingSchema.index({ user: 1, createdAt: -1 });
ClothingSchema.index({
    name: 'text',
    category: 'text',
    brand: 'text',
    tags: 'text'
});
exports.Clothing = mongoose_1.default.model('Clothing', ClothingSchema);
