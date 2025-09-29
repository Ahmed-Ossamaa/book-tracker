const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, " User's Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "User's Last Name is required"]
    },
    fullName: {
        type: String
    },
    email: {
        type: String,
        required: [true, "User's Email is required"],
        unique: true
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

userSchema.pre("save", function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    next();
});

module.exports = mongoose.model("User", userSchema);