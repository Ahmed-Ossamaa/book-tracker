const { BadRequestError } = require("../utils/ApiError");

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            throw new BadRequestError(errors.join(', '));
        }

        next();
    };
};


const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            throw new BadRequestError(errors.join(', '));
        }
        req.query = value;
        next();
    };
};


module.exports = { validate, validateQuery };
