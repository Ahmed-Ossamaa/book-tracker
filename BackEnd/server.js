const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")
// ================ import routes ====================
const userRoutes = require("./routes/userRoutes")
const booksRoutes = require("./routes/bookRoutes")


// ================ Database connection ===============
dotenv.config();
connectDB();
//====================for payment=====================
// payment before json

// =================== middlewares ====================
const app = express();
app.use(cors());
app.use(express.json());

// ===================== routes ========================
app.use("/users", userRoutes)
app.use("/books", booksRoutes)

// ================ Centralized error handler =================
app.use(errorHandler)

// =================== start server ====================
const PORT = process.env.PORT ||5000
app.listen(PORT,() => console.log(`App is running on port ${PORT}`) )
