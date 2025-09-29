const express = require("express")
const isAdmin = require("../middleware/adminMiddleware")
const protect = require("../middleware/authMiddleware")
//import controllers functions

//................................................................................

const router= express.Router()

//============================= Public routes =====================================

router.post("/register",   )
router.post("/login",   )

//======================== Admin routes (loged in)===================================
//get All users 
router.get("/",protect,isAdmin,   )

//delete user by id
router.delete("/:id",protect,isAdmin,   )

module.exports = router