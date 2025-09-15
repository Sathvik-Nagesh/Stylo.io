"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.deleteAccount = exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const Clothing_1 = require("../models/Clothing");
const Outfit_1 = require("../models/Outfit");
const mongoose_1 = __importDefault(require("mongoose"));
const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User_1.User.findById(userId);
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, email, preferences, avatar } = req.body;
        if (username || email) {
            const existingUser = await User_1.User.findOne({
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
        const updateData = {};
        if (username)
            updateData.username = username;
        if (email)
            updateData.email = email;
        if (preferences)
            updateData.preferences = preferences;
        if (avatar !== undefined)
            updateData.avatar = avatar;
        const user = await User_1.User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update'
        });
    }
};
exports.updateProfile = updateProfile;
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await Promise.all([
            Clothing_1.Clothing.deleteMany({ user: userId }),
            Outfit_1.Outfit.deleteMany({ user: userId }),
            User_1.User.findByIdAndDelete(userId)
        ]);
        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during account deletion'
        });
    }
};
exports.deleteAccount = deleteAccount;
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const [clothingCount, outfitCount, recentClothing, recentOutfits, favoriteClothing, favoriteOutfits] = await Promise.all([
            Clothing_1.Clothing.countDocuments({ user: userId }),
            Outfit_1.Outfit.countDocuments({ user: userId }),
            Clothing_1.Clothing.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name type category color imageUrl createdAt'),
            Outfit_1.Outfit.find({ user: userId })
                .populate('items', 'name type category color imageUrl')
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name occasion items createdAt'),
            Clothing_1.Clothing.find({ user: userId, isFavorite: true })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('name type category color imageUrl'),
            Outfit_1.Outfit.find({ user: userId, isFavorite: true })
                .populate('items', 'name type category color imageUrl')
                .sort({ createdAt: -1 })
                .limit(10)
                .select('name occasion items')
        ]);
        const clothingTypes = await Clothing_1.Clothing.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(userId) } },
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const outfitOccasions = await Outfit_1.Outfit.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(userId) } },
            { $group: { _id: '$occasion', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const mostWornItems = await Clothing_1.Clothing.find({ user: userId })
            .sort({ wearCount: -1 })
            .limit(5)
            .select('name type category color imageUrl wearCount');
        const mostWornOutfits = await Outfit_1.Outfit.find({ user: userId })
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
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during dashboard stats retrieval'
        });
    }
};
exports.getDashboardStats = getDashboardStats;
