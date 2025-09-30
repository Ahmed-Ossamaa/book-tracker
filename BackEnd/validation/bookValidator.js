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
    author: joi.string().optional().messages({
        "string.empty": "Book author can't be empty"
    }),
    category: joi.string()
        .valid(...categories).messages({
            "any.only": "Invalid category",
        }),
    coverImage: joi.string().optional(),
    rating: joi.number().optional().min(1).max(5).messages({
        "number.empty": "Book rating can't be empty",
        "number.min": "Book rating should be at least 1",
        "number.max": "Book rating should not exceed 5"
    }),
    review: joi.string().optional()
});

// =========================== Edit book schema ===============================
const editBookSchema = joi.object({
    title: joi.string().min(2).max(50).messages({
        "string.empty": "Book title can't be empty",
        "string.min": "Book title must be at least 2 characters",
        "string.max": "Book title must not exceed 50 characters"
    }).optional(),
    author: joi.string().messages({
        "string.empty": "Book author can't be empty"
    }).optional(),
    category: joi.string()
        .valid(...categories)
        .messages({"any.only": "Invalid category"}).optional(),
    coverImage: joi.string().optional(),
    rating: joi.number().min(1).max(5).messages({
        "number.min": "Book rating should be at least 1",
        "number.max": "Book rating should not exceed 5"
    }).optional(),
    review: joi.string().optional()
});

module.exports = { addBookSchema, editBookSchema };



