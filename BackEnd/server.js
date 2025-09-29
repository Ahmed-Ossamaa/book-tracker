const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const dotenv = require("dotenv")

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




// =================== start server ====================
const PORT = process.env.PORT ||5000
app.listen(PORT,() => console.log(`App is running on port ${PORT}`) )

// ================ Centralized error handler =================