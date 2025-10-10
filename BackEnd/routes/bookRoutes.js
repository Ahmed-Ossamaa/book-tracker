const express = require('express')
//import middlewares
const {isAdmin} = require("../middleware/adminMiddleware")
const {protect} = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
//import controllers functions
const {getBooks, getBook, addBook, editBook, deleteBook, getAllBooks } = require("../controllers/bookController")
//import validators
const {paginationSchema} = require('../validation/paginationValidator')
const {addBookSchema,editBookSchema} = require('../validation/bookValidator')
const {validateQuery,validate}  = require('../middleware/validate')



const router = express.Router()
router.use(protect); // all routes are protected
//=========================== Admin routes ===========================
router.get("/all",isAdmin,validateQuery(paginationSchema),getAllBooks)
router.get("/user/:id",isAdmin,validateQuery(paginationSchema),getAllBooks)

//=========================== User routes ===========================

//get books
router.get("/",validateQuery(paginationSchema),getBooks)
router.get("/:id",getBook)

//add book
router.post("/", upload.single("coverImage"), validate(addBookSchema), addBook)

//edit book by id
router.patch("/:id", upload.single("coverImage"), validate(editBookSchema), editBook)

//delete book by id
router.delete("/:id", deleteBook)


module.exports = router