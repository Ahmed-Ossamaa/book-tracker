const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");//for hasing password
const jwt = require("jsonwebtoken");//for auth
const asyncHandler = require("express-async-handler");
const { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } = require("../utils/ApiError");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}


// Register
const register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ConflictError(`User with email ${email} already exists`);
    }
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPw });
    res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName, //from preSave in userModel
        email: user.email,
        role: user.role,
        token: generateToken(user.id)
    });

})

// Login
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        });
    } else {
        throw new UnauthorizedError("Invalid email or password");
    }

})

const getMyProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    res.status(200).json({
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt
    });

});


const updateProfile = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email } = req.body;
    if (req.body.password) {
        throw new BadRequestError("Use /users/me/password to update password");
    }

    const user = await User.findById(req.user._id);
    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
        // Check if email is already taken by another user
        const emailExists = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (emailExists) {
            throw new ConflictError("Email already in use");
        }
        user.email = email;
    }

    const updatedUser = await user.save();

    res.status(200).json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role
    });
});

const updatePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        throw new BadRequestError("Current password and new password are required");
    }
    
    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new UnauthorizedError("Current password is incorrect");
    }
    
    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    res.status(200).json({ message: "Password updated successfully" });
});

// Get all users (only admin)
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(users);

})

//delete user by id (only admin)
const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new NotFoundError(`User with id ${id} not found`);
    }
    res.status(200).json({ message: `User ${user.fullName} deleted successfully` });

})

module.exports = { register, login, getAllUsers,getMyProfile ,updateProfile, updatePassword, deleteUser };