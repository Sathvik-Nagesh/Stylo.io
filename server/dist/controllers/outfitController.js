"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOutfit = exports.getOutfitStats = exports.searchOutfits = exports.deleteOutfit = exports.updateOutfit = exports.createOutfit = exports.getOutfit = exports.getOutfits = void 0;
const Outfit_1 = require("../models/Outfit");
const Clothing_1 = require("../models/Clothing");
const mongoose_1 = __importDefault(require("mongoose"));
const getOutfits = async (req, res) => {
    try {
        const userId = req.user._id;
        const { occasion, season, page = 1, limit = 20 } = req.query;
        const query = { user: userId };
        if (occasion)
            query.occasion = occasion;
        if (season)
            query.season = season;
        const skip = (Number(page) - 1) * Number(limit);
        const outfits = await Outfit_1.Outfit.find(query)
            .populate('items', 'name type category color imageUrl')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Outfit_1.Outfit.countDocuments(query);
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
    }
    catch (error) {
        console.error('Get outfits error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getOutfits = getOutfits;
const getOutfit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid outfit ID'
            });
        }
        const outfit = await Outfit_1.Outfit.findOne({ _id: id, user: userId })
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
    }
    catch (error) {
        console.error('Get outfit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getOutfit = getOutfit;
const createOutfit = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items } = req.body;
        const userItems = await Clothing_1.Clothing.find({
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
        const outfit = await Outfit_1.Outfit.create(outfitData);
        const populatedOutfit = await Outfit_1.Outfit.findById(outfit._id)
            .populate('items', 'name type category color imageUrl');
        res.status(201).json({
            success: true,
            message: 'Outfit created successfully',
            data: populatedOutfit
        });
    }
    catch (error) {
        console.error('Create outfit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during outfit creation'
        });
    }
};
exports.createOutfit = createOutfit;
const updateOutfit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { items } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid outfit ID'
            });
        }
        if (items) {
            const userItems = await Clothing_1.Clothing.find({
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
        const outfit = await Outfit_1.Outfit.findOneAndUpdate({ _id: id, user: userId }, req.body, { new: true, runValidators: true }).populate('items', 'name type category color imageUrl');
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
    }
    catch (error) {
        console.error('Update outfit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during outfit update'
        });
    }
};
exports.updateOutfit = updateOutfit;
const deleteOutfit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid outfit ID'
            });
        }
        const outfit = await Outfit_1.Outfit.findOneAndDelete({ _id: id, user: userId });
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
    }
    catch (error) {
        console.error('Delete outfit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during outfit deletion'
        });
    }
};
exports.deleteOutfit = deleteOutfit;
const searchOutfits = async (req, res) => {
    try {
        const userId = req.user._id;
        const { q, occasion, season, page = 1, limit = 20 } = req.query;
        const query = { user: userId };
        if (q) {
            query.$text = { $search: q };
        }
        if (occasion)
            query.occasion = occasion;
        if (season)
            query.season = season;
        const skip = (Number(page) - 1) * Number(limit);
        const outfits = await Outfit_1.Outfit.find(query)
            .populate('items', 'name type category color imageUrl')
            .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Outfit_1.Outfit.countDocuments(query);
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
    }
    catch (error) {
        console.error('Search outfits error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during search'
        });
    }
};
exports.searchOutfits = searchOutfits;
const getOutfitStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const stats = await Outfit_1.Outfit.aggregate([
            { $match: { user: new mongoose_1.default.Types.ObjectId(userId) } },
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
        const occasionStats = {};
        result.byOccasion.forEach((item) => {
            occasionStats[item.occasion] = (occasionStats[item.occasion] || 0) + item.count;
        });
        const seasonStats = {};
        result.bySeason.forEach((item) => {
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
    }
    catch (error) {
        console.error('Get outfit stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during stats retrieval'
        });
    }
};
exports.getOutfitStats = getOutfitStats;
const generateOutfit = async (req, res) => {
    try {
        const userId = req.user._id;
        const { occasion, season = 'all', style = [], excludeItems = [] } = req.body;
        const query = { user: userId };
        if (season !== 'all')
            query.season = { $in: [season, 'all'] };
        if (excludeItems.length > 0)
            query._id = { $nin: excludeItems };
        const clothingItems = await Clothing_1.Clothing.find(query);
        if (clothingItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No clothing items available for outfit generation'
            });
        }
        const tops = clothingItems.filter(item => item.type === 'top');
        const bottoms = clothingItems.filter(item => item.type === 'bottom');
        const dresses = clothingItems.filter(item => item.type === 'dress');
        const outerwear = clothingItems.filter(item => item.type === 'outerwear');
        const shoes = clothingItems.filter(item => item.type === 'shoes');
        const accessories = clothingItems.filter(item => item.type === 'accessories');
        const generatedOutfit = {
            name: `Generated Outfit for ${occasion}`,
            occasion,
            season,
            style,
            items: [],
            description: `AI-generated outfit for ${occasion}`
        };
        if (occasion.toLowerCase().includes('formal') || occasion.toLowerCase().includes('business')) {
            if (dresses.length > 0) {
                generatedOutfit.items.push(dresses[Math.floor(Math.random() * dresses.length)]._id);
            }
            else if (tops.length > 0 && bottoms.length > 0) {
                generatedOutfit.items.push(tops[Math.floor(Math.random() * tops.length)]._id);
                generatedOutfit.items.push(bottoms[Math.floor(Math.random() * bottoms.length)]._id);
            }
        }
        else if (occasion.toLowerCase().includes('casual') || occasion.toLowerCase().includes('everyday')) {
            if (tops.length > 0 && bottoms.length > 0) {
                generatedOutfit.items.push(tops[Math.floor(Math.random() * tops.length)]._id);
                generatedOutfit.items.push(bottoms[Math.floor(Math.random() * bottoms.length)]._id);
            }
            else if (dresses.length > 0) {
                generatedOutfit.items.push(dresses[Math.floor(Math.random() * dresses.length)]._id);
            }
        }
        else {
            if (dresses.length > 0) {
                generatedOutfit.items.push(dresses[Math.floor(Math.random() * dresses.length)]._id);
            }
            else if (tops.length > 0 && bottoms.length > 0) {
                generatedOutfit.items.push(tops[Math.floor(Math.random() * tops.length)]._id);
                generatedOutfit.items.push(bottoms[Math.floor(Math.random() * bottoms.length)]._id);
            }
        }
        if (outerwear.length > 0 && (season === 'winter' || season === 'fall')) {
            generatedOutfit.items.push(outerwear[Math.floor(Math.random() * outerwear.length)]._id);
        }
        if (shoes.length > 0) {
            generatedOutfit.items.push(shoes[Math.floor(Math.random() * shoes.length)]._id);
        }
        if (accessories.length > 0 && Math.random() > 0.5) {
            generatedOutfit.items.push(accessories[Math.floor(Math.random() * accessories.length)]._id);
        }
        if (generatedOutfit.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Unable to generate outfit with available clothing items'
            });
        }
        const populatedItems = await Clothing_1.Clothing.find({
            _id: { $in: generatedOutfit.items }
        }).select('name type category color imageUrl brand');
        res.json({
            success: true,
            data: {
                ...generatedOutfit,
                items: populatedItems
            }
        });
    }
    catch (error) {
        console.error('Generate outfit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during outfit generation'
        });
    }
};
exports.generateOutfit = generateOutfit;
