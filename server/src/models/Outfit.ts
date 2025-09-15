import mongoose, { Document, Schema } from 'mongoose';

export interface IOutfit extends Document {
  name: string;
  description?: string;
  items: mongoose.Types.ObjectId[];
  occasion: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  style: string[];
  tags: string[];
  isFavorite: boolean;
  rating?: number;
  notes?: string;
  lastWorn?: Date;
  wearCount: number;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OutfitSchema = new Schema<IOutfit>({
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
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
OutfitSchema.index({ user: 1, occasion: 1 });
OutfitSchema.index({ user: 1, season: 1 });
OutfitSchema.index({ user: 1, isFavorite: 1 });
OutfitSchema.index({ user: 1, createdAt: -1 });
OutfitSchema.index({ user: 1, rating: -1 });

// Text index for search functionality
OutfitSchema.index({
  name: 'text',
  description: 'text',
  occasion: 'text',
  tags: 'text'
});

// Validation to ensure outfit has at least one item
OutfitSchema.pre('save', function(next) {
  if (this.items.length === 0) {
    next(new Error('Outfit must have at least one clothing item'));
  } else {
    next();
  }
});

export const Outfit = mongoose.model<IOutfit>('Outfit', OutfitSchema);
