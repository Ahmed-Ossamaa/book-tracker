const express = require("express")
const { isAdmin } = require("../middleware/adminMiddleware")
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
//import controllers functions
const { register, login, getAllUsers, deleteUser, getMyProfile,
        updateProfile, updatePassword, toggleBanUser,
        toggleRole } = require("../controllers/userController")
//import validators
const { registerSchema, loginSchema, updateProfileSchema, updatePwSchema } = require("../validation/userValidator")
const { paginationSchema } = require("../validation/paginationValidator")
const { validate, validateQuery } = require("../middleware/validate")
//................................................................................

const router = express.Router()

//============================= Public routes =====================================

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)


//============================= protected routes==================================
router.use(protect)
//========================= Protected User routes ==================================
router.get("/me", getMyProfile)//get my profile
router.patch("/me", upload.single("profilePic"), validate(updateProfileSchema), updateProfile)//update my profile
router.patch("/me/password", validate(updatePwSchema), updatePassword)//update my password

//======================== Protected Admin routes ===================================
//get All users 
router.get("/all", isAdmin, validateQuery(paginationSchema), getAllUsers)

//delete user by id
router.patch("/role/:id", isAdmin, toggleRole)
router.patch("/ban/:id", isAdmin, toggleBanUser)
router.delete("/:id", isAdmin, deleteUser)


module.exports = router