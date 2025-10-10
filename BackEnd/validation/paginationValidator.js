const Joi = require("joi");

const paginationSchema = Joi.object({
    category: Joi.string().optional(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(999999).default(12),
    search: Joi.string().optional(),
    sortBy: Joi.string().valid("title", "author", "category", "createdAt", "updatedAt").default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
    userId: Joi.string().allow("").optional()

});

module.exports = { paginationSchema };
