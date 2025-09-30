const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")
// ================ import routes ====================
const userRoutes = require("./routes/userRoutes")
const booksRoutes = require("./routes/bookRoutes")


// ================== Database connection ===================
dotenv.config();
connectDB();
//========================for payment=======================
// payment before json

// ===================== Middlewares =======================
const app = express();
app.use(cors());
app.use(express.json());

// ========================= Routes ============================
app.use("/users", userRoutes)
app.use("/books", booksRoutes)

// ================ Centralized error handler ===================
app.use(errorHandler)

// ======================= Start server ==========================
const PORT = process.env.PORT ||5000
app.listen(PORT,() => console.log(`App is running on port ${PORT}`) )



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