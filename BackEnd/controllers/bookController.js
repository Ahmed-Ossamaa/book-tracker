
const Book = require("../models/booksModel");
const asyncHandler = require("express-async-handler");
const { NotFoundError } = require("../utils/ApiError");

// User : get user's own books
const getBooks = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 12 } = req.query
    const skip = (page - 1) * limit;
    const books = await Book.find({ user: req.user._id }).skip(skip).limit(Number(limit));
    const total = await Book.countDocuments({ user: req.user.id });
    res.status(200).json(
        {
            page: Number(page),
            limit: Number(limit),
            total,
            books
        }
    );
})


//User : get user's own book by id
const getBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const book = await Book.findOne({ _id: id, user: req.user.id })
    if (!book) {
        throw new NotFoundError("Book not found or not authorized");
    }
    res.status(200).json(book)

})

//User : add book
const addBook = asyncHandler(async (req, res, next) => {
    const { title, author, category, coverImage, rating, review } = req.body;

    const book = await Book.create({
        title,
        author,
        category,
        coverImage,
        rating,
        review,
        user: req.user.id
    })
    res.status(201).json({
        message: `${book.title} added successfully`,
        book
    });


})

//User : update book by id
const editBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { title, author, category, coverImage, rating, review } = req.body;

    const book = await Book.findOne({ _id: id, user: req.user.id })
    if (!book) {
        throw new NotFoundError("Book not found or not authorized");;
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (category !== undefined) book.category = category;
    if (coverImage !== undefined) book.coverImage = coverImage;
    if (rating !== undefined) book.rating = rating;
    if (review !== undefined) book.review = review;
    const updatedBook = await book.save();

    res.status(200).json({
        message: `${updatedBook.title} updated successfully`,
        book: updatedBook
    });

})

//User : delete book by id
const deleteBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const book = await Book.findOneAndDelete({ _id: id, user: req.user.id })
    if (!book) {
        throw new NotFoundError("Book not found or not authorized");
    }
    res.status(200).json(`${book.title} deleted successfully`)

})

//Admin : get all books for all users
const getAllBooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 12 } = req.query
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(Number(limit));
    const total = await Book.countDocuments();
    res.status(200).json(
        {
            page: Number(page),
            limit: Number(limit),
            total,
            books
        }
    );

})

module.exports = {
    getBooks,
    getBook,
    addBook,
    editBook,
    deleteBook,
    getAllBooks
}
