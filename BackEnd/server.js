const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")
const { NotFoundError } = require("./utils/ApiError")
// ==================Security Improrts==================
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize')
//need to search and add anti xss middlewares 
// ================ import routes ====================
const userRoutes = require("./routes/userRoutes")
const booksRoutes = require("./routes/bookRoutes")
// ================== Database connection ===================
dotenv.config();
connectDB();
//========================for payment=======================
// payment before json for later

// ===================== Middlewares and Security =======================
const app = express();
app.use(helmet()); //secutity http headers
const limiter = rateLimit({
    max: 100, // 100 requests
    windowMs: 15 * 60 * 1000, // per 15 minutes
    message: 'Too many requests from this IP, please try again later' //it sends 429
});
app.use(limiter);
app.use(mongoSanitize()); //prevents mongo injection if passed joi validation
app.use(cors());
app.use(express.json());

// ========================= Routes ============================
app.use("/users",userRoutes)
app.use("/books",booksRoutes)
app.all(/.*/, (req, res, next) => {
    throw new NotFoundError(`Path ${req.originalUrl} not found`);
});

// ================ Centralized error handler ===================
app.use(errorHandler)

// ======================= Start server ==========================
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`App is running on port ${PORT}`))



//======unhandled errors and uncaught exceptions from outside of express======
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});