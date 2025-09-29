class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}


class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(400, message);
        this.name = 'BadRequestError';
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(401, message);
        this.name = 'UnauthorizedError';
    }
}

class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(403, message);
        this.name = 'ForbiddenError';
    }
}

class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(404, message);
        this.name = 'NotFoundError'
    }
}

class ConflictError extends ApiError {
    constructor(message = "Already Exists") {
        super(409, message);
        this.name = 'ConflictError';
    }
}

module.exports = {
    ApiError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
};
