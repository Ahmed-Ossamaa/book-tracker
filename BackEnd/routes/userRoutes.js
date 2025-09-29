const express = require("express")
const {isAdmin} = require("../middleware/adminMiddleware")
const {protect} = require("../middleware/authMiddleware")
//import controllers functions
const {register,login,getAllUsers,deleteUser} = require("../controllers/userController")
//import validators
const { registerSchema, loginSchema } = require("../validation/userValidator")
const {paginationSchema} = require("../validation/paginationValidator")
const {validate, validateQuery}  = require("../middleware/validate")
//................................................................................

const router= express.Router()

//============================= Public routes =====================================

router.post("/register",validate(registerSchema),register)
router.post("/login",validate(loginSchema),login)

//======================== Admin routes (loged in)===================================
//get All users 
router.get("/",protect,isAdmin,validateQuery(paginationSchema),getAllUsers)

//delete user by id
router.delete("/:id",protect,isAdmin,deleteUser)


module.exports = router