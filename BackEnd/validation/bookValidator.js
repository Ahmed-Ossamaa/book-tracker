const joi = require("joi");
const categories = require("../utils/bookCategories");
// =========================== Add book schema ===============================
const addBookSchema = joi.object({
    title: joi.string().required().min(2).max(50).messages({
        "string.empty": "Book title can't be empty",
        "any.required": "Book title is required",
        "string.min": "Book title must be at least 2 characters",
        "string.max": "Book title must not exceed 50 characters"
    }),
    author: joi.string().trim().allow("").default("Unknown Author"),
    category: joi.string()
        .valid(...categories).messages({
            "any.only": "Invalid category",
        }),
    coverImage: joi.string().optional(),
    rating: joi.number().min(0).max(5).optional().allow(null).when('review', {
        is: joi.string().min(1),
        then: joi.number().required().messages({
            "any.required": "Rating is required when review is provided",
            "number.base": "Rating must be a number"
        })
    }).messages({
        "number.min": "Book rating should be at least 1",
        "number.max": "Book rating should not exceed 5"
    }),
    review: joi.string().optional().allow(""),
    status: joi.string().valid("Read", "To Read", "Reading").default("Read")
});

// =========================== Edit book schema ===============================
const editBookSchema = joi.object({
    title: joi.string().min(2).max(50).messages({
        "string.empty": "Book title can't be empty",
        "string.min": "Book title must be at least 2 characters",
        "string.max": "Book title must not exceed 50 characters"
    }).optional(),
    author: joi.string().allow("").default("Unknown Author").optional(),
    category: joi.string()
        .valid(...categories)
        .messages({ "any.only": "Invalid category" }).optional(),
    coverImage: joi.string().optional(),
    rating: joi.number().min(0).max(5).optional().allow(null).messages({
        "number.min": "Book rating should be at least 0",
        "number.max": "Book rating should not exceed 5"
    }),
    review: joi.string().optional().allow("").allow(null),
    status: joi.string().valid("Read", "To Read", "Reading").optional()
});

module.exports = { addBookSchema, editBookSchema };



