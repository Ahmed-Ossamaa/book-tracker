const joi = require("joi");


const messageSchema = joi.object({
    name: joi.string().required().messages({
        "string.empty": "Name can't be empty",
        "any.required": "Name is required"
    }),

    email: joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
        "string.empty": "Email can't be empty"
    }),

    subject: joi.string().max(50).required().messages({
        "string.empty": "Subject can't be empty",
        "string.max": "Subject must not exceed 50 characters",
        "any.required": "Subject is required"
    }),

    message: joi.string().max(500).required().messages({
        "string.empty": "Message can't be empty",
        "string.max": "Message must not exceed 500 characters",
        "any.required": "Message is required"
    })
});

module.exports = {messageSchema};