const mongoose = require("mongoose")
const categories = require("../utils/bookCategories")

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        minLength: [2, "Book title should be atleast 2 characters"],
        maxLength: [50, "Book title shouldnt exceed 50 characters"]

    },
    author: {
        type: String,
        default: "Unknown Author"
    },
    category: {
        type: String,
        enum: categories,
        default: "Other"
    },
    status: {
        type: String,
        enum: ["Read", "To Read", "Reading"],
        default: "Read"
    },

    coverImage: { type: String },
    coverImageId: { type: String },
    rating: {
        type: Number,
        default: null,
        min: 0,
        max: 5,
        validate: {
            validator: function (value) {
                return value == null || (value >= 0 && value <= 5);
            },
            message: "Book rating should be between 0 and 5"
        }
    },
    review: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

module.exports = mongoose.model("Book", bookSchema);