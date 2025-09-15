"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClothingStats = exports.searchClothingItems = exports.deleteClothingItem = exports.updateClothingItem = exports.createClothingItem = exports.getClothingItem = exports.getClothingItems = void 0;
const Clothing_1 = require("../models/Clothing");
const mongoose_1 = __importDefault(require("mongoose"));
const getClothingItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, color, season, page = 1, limit = 20 } = req.query;
        const query = { user: userId };
        if (type)
            query.type = type;
        if (color)
            query.color = color;
        if (season)
            query.season = season;
        const skip = (Number(page) - 1) * Number(limit);
        const clothingItems = await Clothing_1.Clothing.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Clothing_1.Clothing.countDocuments(query);
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
    }
    catch (error) {
        console.error('Get clothing items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getClothingItems = getClothingItems;
const getClothingItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid clothing item ID'
            });
        }
        const clothingItem = await Clothing_1.Clothing.findOne({ _id: id, user: userId });
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
    }
    catch (error) {
        console.error('Get clothing item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getClothingItem = getClothingItem;
const createClothingItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const clothingData = { ...req.body, user: userId };
        const clothingItem = await Clothing_1.Clothing.create(clothingData);
        res.status(201).json({
            success: true,
            message: 'Clothing item created successfully',
            data: clothingItem
        });
    }
    catch (error) {
        console.error('Create clothing item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during clothing item creation'
        });
    }
};
exports.createClothingItem = createClothingItem;
const updateClothingItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid clothing item ID'
            });
        }
        const clothingItem = await Clothing_1.Clothing.findOneAndUpdate({ _id: id, user: userId }, req.body, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.error('Update clothing item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during clothing item update'
        });
    }
};
exports.updateClothingItem = updateClothingItem;
const deleteClothingItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid clothing item ID'
            });
        }
        const clothingItem = await Clothing_1.Clothing.findOneAndDelete({ _id: id, user: userId });
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
    }
    catch (error) {
        console.error('Delete clothing item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during clothing item deletion'
        });
    }
};
exports.deleteClothingItem = deleteClothingItem;
const searchClothingItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const { q, type, color, season, page = 1, limit = 20 } = req.query;
        const query = { user: userId };
        if (q) {
            query.$text = { $search: q };
        }
        if (type)
            query.type = type;
        if (color)
            query.color = color;
        if (season)
            query.season = season;
        const skip = (Number(page) - 1) * Number(limit);
        const clothingItems = await Clothing_1.Clothing.find(query)
            .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Clothing_1.Clothing.countDocuments(query);
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
    }
    catch (error) {
        console.error('Search clothing items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during search'
        });
    }
};
exports.searchClothingItems = searchClothingItems;
const getClothingStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const stats = await Clothing_1.Clothing.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(userId) } },
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
        const typeStats = {};
        result.byType.forEach((item) => {
            typeStats[item.type] = (typeStats[item.type] || 0) + item.count;
        });
        const colorStats = {};
        result.byColor.forEach((item) => {
            colorStats[item.color] = (colorStats[item.color] || 0) + item.count;
        });
        const seasonStats = {};
        result.bySeason.forEach((item) => {
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
    }
    catch (error) {
        console.error('Get clothing stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during stats retrieval'
        });
    }
};
exports.getClothingStats = getClothingStats;
