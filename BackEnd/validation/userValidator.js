const joi = require("joi");
// =========================== Register schema ===============================
const registerSchema = joi.object({
    firstName: joi.string().required().messages({
        "string.empty": "User first name can't be empty",
        "any.required": "User first name is required"
    }),
    lastName: joi.string().required().messages({
        "string.empty": "User last name can't be empty",
        "any.required": "User last name is required"
    }),
    email: joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
        "string.empty": "Email can't be empty"
    }),
    password: joi.string().min(6).max(30).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must not exceed 30 characters",
        "any.required": "Password is required"
    })
});

// =========================== Login schema ================================
const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required"
    }),
    password: joi.string().min(6).max(30).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must not exceed 30 characters",
        "any.required": "Password is required"
    })
});

// =========================== Update profile schema ===============================
const updateProfileSchema = joi.object({
    firstName: joi.string().optional().messages({
        "string.empty": "User first name can't be empty"
    }),
    lastName: joi.string().optional().messages({
        "string.empty": "User last name can't be empty"
    }),
    email: joi.string().email().optional().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email can't be empty"
    }),
    profilePicture: joi.string().optional()
});

// =========================== Update password schema ===============================
const updatePwSchema = joi.object({
    currentPassword: joi.string().required().messages({
        "any.required": "Current password is required"
    }),
    newPassword: joi.string().min(6).max(30).required().messages({
        "string.min": "New password must be at least 6 characters",
        "string.max": "New password must not exceed 30 characters",
        "any.required": "New password is required"
    })
});

module.exports = { registerSchema, loginSchema,updateProfileSchema,updatePwSchema };


