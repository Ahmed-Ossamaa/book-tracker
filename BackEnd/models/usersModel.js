const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, " User's Name is required"]
    },
    email: {
        type: String,
        required: [true, "User's Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be atleast 6 characters"],
        maxLength: [30, "Password must be atmost 30 characters"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);