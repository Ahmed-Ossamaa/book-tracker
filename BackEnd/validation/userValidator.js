const joi = require("joi");

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
    password: joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required"
    })
});


const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required"
    }),
    password: joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required"
    })
});

module.exports = {registerSchema,loginSchema};


