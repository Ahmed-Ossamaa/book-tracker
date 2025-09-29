const { ForbiddenError } = require("../utils/ApiError");


const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        throw new ForbiddenError("Admin access required");
    }
};

module.exports = { isAdmin };