import mongoose, { Document, Schema } from 'mongoose';

export interface IClothing extends Document {
  name: string;
  type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories';
  category: string;
  color: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  style: string[];
  brand?: string;
  size?: string;
  material?: string;
  imageUrl: string;
  imagePath: string;
  tags: string[];
  isFavorite: boolean;
  lastWorn?: Date;
  wearCount: number;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ClothingSchema = new Schema<IClothing>({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
ClothingSchema.index({ user: 1, type: 1 });
ClothingSchema.index({ user: 1, color: 1 });
ClothingSchema.index({ user: 1, season: 1 });
ClothingSchema.index({ user: 1, isFavorite: 1 });
ClothingSchema.index({ user: 1, createdAt: -1 });

// Text index for search functionality
ClothingSchema.index({
  name: 'text',
  category: 'text',
  brand: 'text',
  tags: 'text'
});

export const Clothing = mongoose.model<IClothing>('Clothing', ClothingSchema);
