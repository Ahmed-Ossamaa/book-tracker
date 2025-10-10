const dotenv = require("dotenv")
dotenv.config();
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")
const { NotFoundError } = require("./utils/ApiError")
// ==================Security Imports==================
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
//need to search and add anti xss middlewares 
// ================ import routes ====================
const userRoutes = require("./routes/userRoutes")
const booksRoutes = require("./routes/bookRoutes")
// ================== Database connection ===================
connectDB();
//========================for payment=======================
// payment before json for later

// ===================== Middlewares and Security =======================
const app = express();
app.use(helmet()); //security http headers
const limiter = rateLimit({
    max: 100, // 100 requests
    windowMs: 30 * 60 * 1000, // per 15 minutes
    message: 'Too many requests from this IP, please try again later' //it sends 429
});
app.use(limiter);
app.use(express.json());
app.use(cors());
// ========================= Routes ============================
app.use("/users",userRoutes)
app.use("/books", booksRoutes)
app.all(/.*/, (req, res, next) => {
    throw new NotFoundError(`Path ${req.originalUrl} not found`);
});

// ================ Centralized error handler ===================
app.use(errorHandler)

// ======================= Start server ==========================
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`App is running on port ${PORT}`))



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