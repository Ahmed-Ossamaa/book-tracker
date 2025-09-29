const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const { UnauthorizedError } = require("../utils/ApiError");

const protect = async (req, res, next) => {
    try {
        let token;

        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            throw new UnauthorizedError("Not authorized, no token");
        }

        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            throw new UnauthorizedError("User not found");
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new UnauthorizedError("Invalid token"));
        } else if (error.name === 'TokenExpiredError') {
            next(new UnauthorizedError("Token expired"));
        } else {
            next(error);
        }
    }
}

module.exports = { protect }