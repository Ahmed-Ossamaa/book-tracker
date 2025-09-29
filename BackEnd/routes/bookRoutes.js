const express = require('express')
const isAdmin = require("../middleware/adminMiddleware")
const protect = require("../middleware/authMiddleware")



const router = express.Router()
router.use(protect); // all routes are protected
//=========================== User routes ===========================

//get books
router.get("/", )
router.get("/:id")

//add book
router.post("/", )

//edit book by id
router.patch("/:id", )

//delete book by id
router.delete("/:id", )
//=========================== Admin routes ===========================
router.get("/all",isAdmin,   )


module.exports = router;