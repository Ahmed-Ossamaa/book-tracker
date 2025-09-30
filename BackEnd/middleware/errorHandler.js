const errorHandler = (err, req, res, next) => {
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            message: 'Validation Error',
            errors
        });
    }

    // Handle Mongoose duplicate errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            message: `${field} already exists`
        });
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: `Invalid ${err.path}: ${err.value}`
        });
    }

    // Handle operational errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message,
            name: err.name
        });
    }

    // Handle unexpected errors
    console.error('ERROR', err);
    res.status(500).json({ 
        message: "Internal Server Error" 
    });
};

module.exports = errorHandler;