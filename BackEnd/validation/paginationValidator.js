const Joi = require("joi");

const paginationSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(32).default(12)
});

module.exports = {paginationSchema};
