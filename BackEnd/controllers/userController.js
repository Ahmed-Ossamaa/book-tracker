const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");//for hasing password
const jwt = require("jsonwebtoken");//for auth
const asyncHandler = require("express-async-handler");
const { ConflictError, UnauthorizedError, NotFoundError } = require("../utils/ApiError");

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
        throw new NotFoundError (`User with id ${id} not found`);
    }
    res.status(200).json({ message: `User ${user.fullName} deleted successfully` });

})

module.exports = { register, login, getAllUsers, deleteUser };