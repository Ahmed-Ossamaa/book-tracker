const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        minLength: [2, "Book title should be atleast 2 characters"],
        maxLength: [50, "Book title shouldnt exceed 50 characters"]

    },
    authour: {
        type: String,
        default: "unknown author"
    },
    coverImage: { type: String },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},{ timestamps: true })

module.exports =mongoose.model("Book", bookSchema );