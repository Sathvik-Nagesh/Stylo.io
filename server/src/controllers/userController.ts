import { Request, Response } from 'express';
import { User } from '../models/User';
import { Clothing } from '../models/Clothing';
import { Outfit } from '../models/Outfit';
import mongoose from 'mongoose';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { username, email, preferences, avatar } = req.body;

    // Check if username or email is already taken by another user
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.username === username ? 'Username already taken' : 'Email already registered'
        });
      }
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (preferences) updateData.preferences = preferences;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    // Delete all user's data
    await Promise.all([
      Clothing.deleteMany({ user: userId }),
      Outfit.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deletion'
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const [
      clothingCount,
      outfitCount,
      recentClothing,
      recentOutfits,
      favoriteClothing,
      favoriteOutfits
    ] = await Promise.all([
      Clothing.countDocuments({ user: userId }),
      Outfit.countDocuments({ user: userId }),
      Clothing.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name type category color imageUrl createdAt'),
      Outfit.find({ user: userId })
        .populate('items', 'name type category color imageUrl')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name occasion items createdAt'),
      Clothing.find({ user: userId, isFavorite: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name type category color imageUrl'),
      Outfit.find({ user: userId, isFavorite: true })
        .populate('items', 'name type category color imageUrl')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name occasion items')
    ]);

    // Get clothing type distribution
    const clothingTypes = await Clothing.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get outfit occasion distribution
    const outfitOccasions = await Outfit.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$occasion', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get most worn items
    const mostWornItems = await Clothing.find({ user: userId })
      .sort({ wearCount: -1 })
      .limit(5)
      .select('name type category color imageUrl wearCount');

    // Get most worn outfits
    const mostWornOutfits = await Outfit.find({ user: userId })
      .populate('items', 'name type category color imageUrl')
      .sort({ wearCount: -1 })
      .limit(5)
      .select('name occasion items wearCount');

    res.json({
      success: true,
      data: {
        summary: {
          totalClothing: clothingCount,
          totalOutfits: outfitCount,
          favoriteClothing: favoriteClothing.length,
          favoriteOutfits: favoriteOutfits.length
        },
        recent: {
          clothing: recentClothing,
          outfits: recentOutfits
        },
        favorites: {
          clothing: favoriteClothing,
          outfits: favoriteOutfits
        },
        analytics: {
          clothingTypes,
          outfitOccasions,
          mostWornItems,
          mostWornOutfits
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during dashboard stats retrieval'
    });
  }
};
