"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
        const user = await User_1.User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'User role not authorized' });
        }
        next();
    };
};
exports.authorize = authorize;
