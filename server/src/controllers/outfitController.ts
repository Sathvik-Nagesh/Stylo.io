import { Request, Response } from 'express';
import { Outfit } from '../models/Outfit';
import { Clothing } from '../models/Clothing';
import mongoose from 'mongoose';

export const getOutfits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { occasion, season, page = 1, limit = 20 } = req.query;

    const query: any = { user: userId };

    if (occasion) query.occasion = occasion;
    if (season) query.season = season;

    const skip = (Number(page) - 1) * Number(limit);

    const outfits = await Outfit.find(query)
      .populate('items', 'name type category color imageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Outfit.countDocuments(query);

    res.json({
      success: true,
      data: outfits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get outfits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getOutfit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid outfit ID'
      });
    }

    const outfit = await Outfit.findOne({ _id: id, user: userId })
      .populate('items', 'name type category color imageUrl brand size material');

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }

    res.json({
      success: true,
      data: outfit
    });
  } catch (error) {
    console.error('Get outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const createOutfit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { items } = req.body;

    // Verify all items belong to the user
    const userItems = await Clothing.find({
      _id: { $in: items },
      user: userId
    });

    if (userItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more clothing items not found or do not belong to you'
      });
    }

    const outfitData = { ...req.body, user: userId };
    const outfit = await Outfit.create(outfitData);

    const populatedOutfit = await Outfit.findById(outfit._id)
      .populate('items', 'name type category color imageUrl');

    res.status(201).json({
      success: true,
      message: 'Outfit created successfully',
      data: populatedOutfit
    });
  } catch (error) {
    console.error('Create outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during outfit creation'
    });
  }
};

export const updateOutfit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;
    const { items } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid outfit ID'
      });
    }

    // If items are being updated, verify they belong to the user
    if (items) {
      const userItems = await Clothing.find({
        _id: { $in: items },
        user: userId
      });

      if (userItems.length !== items.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more clothing items not found or do not belong to you'
        });
      }
    }

    const outfit = await Outfit.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('items', 'name type category color imageUrl');

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }

    res.json({
      success: true,
      message: 'Outfit updated successfully',
      data: outfit
    });
  } catch (error) {
    console.error('Update outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during outfit update'
    });
  }
};

export const deleteOutfit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid outfit ID'
      });
    }

    const outfit = await Outfit.findOneAndDelete({ _id: id, user: userId });

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }

    res.json({
      success: true,
      message: 'Outfit deleted successfully'
    });
  } catch (error) {
    console.error('Delete outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during outfit deletion'
    });
  }
};

export const searchOutfits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { q, occasion, season, page = 1, limit = 20 } = req.query;

    const query: any = { user: userId };

    if (q) {
      query.$text = { $search: q as string };
    }
    if (occasion) query.occasion = occasion;
    if (season) query.season = season;

    const skip = (Number(page) - 1) * Number(limit);

    const outfits = await Outfit.find(query)
      .populate('items', 'name type category color imageUrl')
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Outfit.countDocuments(query);

    res.json({
      success: true,
      data: outfits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Search outfits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};

export const getOutfitStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const stats = await Outfit.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOutfits: { $sum: 1 },
          totalWearCount: { $sum: '$wearCount' },
          byOccasion: {
            $push: {
              occasion: '$occasion',
              count: 1
            }
          },
          bySeason: {
            $push: {
              season: '$season',
              count: 1
            }
          },
          favorites: {
            $sum: { $cond: ['$isFavorite', 1, 0] }
          },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        success: true,
        data: {
          totalOutfits: 0,
          totalWearCount: 0,
          byOccasion: {},
          bySeason: {},
          favorites: 0,
          averageRating: 0
        }
      });
    }

    const result = stats[0];

    // Process occasion statistics
    const occasionStats: any = {};
    result.byOccasion.forEach((item: any) => {
      occasionStats[item.occasion] = (occasionStats[item.occasion] || 0) + item.count;
    });

    // Process season statistics
    const seasonStats: any = {};
    result.bySeason.forEach((item: any) => {
      seasonStats[item.season] = (seasonStats[item.season] || 0) + item.count;
    });

    res.json({
      success: true,
      data: {
        totalOutfits: result.totalOutfits,
        totalWearCount: result.totalWearCount,
        byOccasion: occasionStats,
        bySeason: seasonStats,
        favorites: result.favorites,
        averageRating: Math.round((result.averageRating || 0) * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get outfit stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during stats retrieval'
    });
  }
};

export const generateOutfit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { occasion, season = 'all', style = [], excludeItems = [] } = req.body;

    // Get user's clothing items
    const query: any = { user: userId };
    if (season !== 'all') query.season = { $in: [season, 'all'] };
    if (excludeItems.length > 0) query._id = { $nin: excludeItems };

    const clothingItems = await Clothing.find(query);

    if (clothingItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No clothing items available for outfit generation'
      });
    }

    // Simple outfit generation algorithm
    const tops = clothingItems.filter(item => item.type === 'top');
    const bottoms = clothingItems.filter(item => item.type === 'bottom');
    const dresses = clothingItems.filter(item => item.type === 'dress');
    const outerwear = clothingItems.filter(item => item.type === 'outerwear');
    const shoes = clothingItems.filter(item => item.type === 'shoes');
    const accessories = clothingItems.filter(item => item.type === 'accessories');

    const generatedOutfit: any = {
      name: `Generated Outfit for ${occasion}`,
      occasion,
      season,
      style,
      items: [],
      description: `AI-generated outfit for ${occasion}`
    };

    // Generate outfit based on occasion
    if (occasion.toLowerCase().includes('formal') || occasion.toLowerCase().includes('business')) {
      // Formal outfit
      if (dresses.length > 0) {
        generatedOutfit.items.push(dresses[Math.floor(Math.random() * dresses.length)]._id);
      } else if (tops.length > 0 && bottoms.length > 0) {
        generatedOutfit.items.push(tops[Math.floor(Math.random() * tops.length)]._id);
        generatedOutfit.items.push(bottoms[Math.floor(Math.random() * bottoms.length)]._id);
      }
    } else if (occasion.toLowerCase().includes('casual') || occasion.toLowerCase().includes('everyday')) {
      // Casual outfit
      if (tops.length > 0 && bottoms.length > 0) {
        generatedOutfit.items.push(tops[Math.floor(Math.random() * tops.length)]._id);
        generatedOutfit.items.push(bottoms[Math.floor(Math.random() * bottoms.length)]._id);
      } else if (dresses.length > 0) {
        generatedOutfit.items.push(dresses[Math.floor(Math.random() * dresses.length)]._id);
      }
    } else {
      // Default outfit
      if (dresses.length > 0) {
        generatedOutfit.items.push(dresses[Math.floor(Math.random() * dresses.length)]._id);
      } else if (tops.length > 0 && bottoms.length > 0) {
        generatedOutfit.items.push(tops[Math.floor(Math.random() * tops.length)]._id);
        generatedOutfit.items.push(bottoms[Math.floor(Math.random() * bottoms.length)]._id);
      }
    }

    // Add outerwear if available and season appropriate
    if (outerwear.length > 0 && (season === 'winter' || season === 'fall')) {
      generatedOutfit.items.push(outerwear[Math.floor(Math.random() * outerwear.length)]._id);
    }

    // Add shoes
    if (shoes.length > 0) {
      generatedOutfit.items.push(shoes[Math.floor(Math.random() * shoes.length)]._id);
    }

    // Add accessories (optional)
    if (accessories.length > 0 && Math.random() > 0.5) {
      generatedOutfit.items.push(accessories[Math.floor(Math.random() * accessories.length)]._id);
    }

    if (generatedOutfit.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Unable to generate outfit with available clothing items'
      });
    }

    // Populate the items for response
    const populatedItems = await Clothing.find({
      _id: { $in: generatedOutfit.items }
    }).select('name type category color imageUrl brand');

    res.json({
      success: true,
      data: {
        ...generatedOutfit,
        items: populatedItems
      }
    });
  } catch (error) {
    console.error('Generate outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during outfit generation'
    });
  }
};
