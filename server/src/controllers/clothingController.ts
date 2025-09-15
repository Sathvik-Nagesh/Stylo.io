import { Request, Response } from 'express';
import { Clothing } from '../models/Clothing';
import mongoose from 'mongoose';

export const getClothingItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { type, color, season, page = 1, limit = 20 } = req.query;

    const query: any = { user: userId };

    if (type) query.type = type;
    if (color) query.color = color;
    if (season) query.season = season;

    const skip = (Number(page) - 1) * Number(limit);

    const clothingItems = await Clothing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Clothing.countDocuments(query);

    res.json({
      success: true,
      data: clothingItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get clothing items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getClothingItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid clothing item ID'
      });
    }

    const clothingItem = await Clothing.findOne({ _id: id, user: userId });

    if (!clothingItem) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found'
      });
    }

    res.json({
      success: true,
      data: clothingItem
    });
  } catch (error) {
    console.error('Get clothing item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const createClothingItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const clothingData = { ...req.body, user: userId };

    const clothingItem = await Clothing.create(clothingData);

    res.status(201).json({
      success: true,
      message: 'Clothing item created successfully',
      data: clothingItem
    });
  } catch (error) {
    console.error('Create clothing item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during clothing item creation'
    });
  }
};

export const updateClothingItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid clothing item ID'
      });
    }

    const clothingItem = await Clothing.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!clothingItem) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found'
      });
    }

    res.json({
      success: true,
      message: 'Clothing item updated successfully',
      data: clothingItem
    });
  } catch (error) {
    console.error('Update clothing item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during clothing item update'
    });
  }
};

export const deleteClothingItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid clothing item ID'
      });
    }

    const clothingItem = await Clothing.findOneAndDelete({ _id: id, user: userId });

    if (!clothingItem) {
      return res.status(404).json({
        success: false,
        message: 'Clothing item not found'
      });
    }

    res.json({
      success: true,
      message: 'Clothing item deleted successfully'
    });
  } catch (error) {
    console.error('Delete clothing item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during clothing item deletion'
    });
  }
};

export const searchClothingItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { q, type, color, season, page = 1, limit = 20 } = req.query;

    const query: any = { user: userId };

    if (q) {
      query.$text = { $search: q as string };
    }
    if (type) query.type = type;
    if (color) query.color = color;
    if (season) query.season = season;

    const skip = (Number(page) - 1) * Number(limit);

    const clothingItems = await Clothing.find(query)
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Clothing.countDocuments(query);

    res.json({
      success: true,
      data: clothingItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Search clothing items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};

export const getClothingStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const stats = await Clothing.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalWearCount: { $sum: '$wearCount' },
          byType: {
            $push: {
              type: '$type',
              count: 1
            }
          },
          byColor: {
            $push: {
              color: '$color',
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
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        success: true,
        data: {
          totalItems: 0,
          totalWearCount: 0,
          byType: {},
          byColor: {},
          bySeason: {},
          favorites: 0
        }
      });
    }

    const result = stats[0];

    // Process type statistics
    const typeStats: any = {};
    result.byType.forEach((item: any) => {
      typeStats[item.type] = (typeStats[item.type] || 0) + item.count;
    });

    // Process color statistics
    const colorStats: any = {};
    result.byColor.forEach((item: any) => {
      colorStats[item.color] = (colorStats[item.color] || 0) + item.count;
    });

    // Process season statistics
    const seasonStats: any = {};
    result.bySeason.forEach((item: any) => {
      seasonStats[item.season] = (seasonStats[item.season] || 0) + item.count;
    });

    res.json({
      success: true,
      data: {
        totalItems: result.totalItems,
        totalWearCount: result.totalWearCount,
        byType: typeStats,
        byColor: colorStats,
        bySeason: seasonStats,
        favorites: result.favorites
      }
    });
  } catch (error) {
    console.error('Get clothing stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during stats retrieval'
    });
  }
};
