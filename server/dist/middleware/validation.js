"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    };
};
exports.validate = validate;
const sanitizeInput = (req, res, next) => {
    const sanitizeString = (str) => {
        return str
            .trim()
            .replace(/[<>]/g, '')
            .substring(0, 1000);
    };
    const sanitizeObject = (obj) => {
        if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = sanitizeObject(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    };
    req.body = sanitizeObject(req.body);
    req.query = sanitizeObject(req.query);
    req.params = sanitizeObject(req.params);
    next();
};
exports.sanitizeInput = sanitizeInput;
