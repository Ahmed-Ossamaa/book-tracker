const Book = require("../models/booksModel");
const User = require("../models/usersModel");
const { bookFilter, sortOption, calcBookStats } = require('../utils/bookHelpers');
const asyncHandler = require("express-async-handler");
const { NotFoundError } = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary"); // for destroying images

// User : get user's own books
const getBooks = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    // category filter
    const booksFilter = { user: userId };
    if (category && category !== 'All') {
        booksFilter.category = category;
    }

    // pagination
    const books = await Book.find(booksFilter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const filteredTotal = await Book.countDocuments(booksFilter);
    const allUserBooks = await Book.find({ user: userId });

    const stats = {
        total: allUserBooks.length,
        withReviews: allUserBooks.filter(b => b.review && b.review.trim() !== '').length,
        averageRating: allUserBooks.length > 0
            ? (allUserBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / allUserBooks.length).toFixed(1)
            : 0,
        byCategory: {},
        status: {
            read: allUserBooks.filter(b => b.status === 'Read').length,
            toRead: allUserBooks.filter(b => b.status === 'To Read').length,
            reading: allUserBooks.filter(b => b.status === 'Reading').length
        }
    };

    allUserBooks.forEach(book => {
        if (book.category) {
            stats.byCategory[book.category] = (stats.byCategory[book.category] || 0) + 1;
        }
    });

    res.status(200).json({
        page: Number(page),
        limit: Number(limit),
        total: filteredTotal,
        stats,
        books
    });
});

//User : get user's own book by id
const getBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const book = await Book.findOne({ _id: id })
    if (!book) {
        throw new NotFoundError("Book not found or not authorized");
    }
    // Check ownership OR admin
    if (book.user.toString() !== req.user.id && req.user.role !== "admin") {
        throw new NotFoundError("Not authorized to delete this book");
    }

    res.status(200).json(book)
})

//User : add book
const addBook = asyncHandler(async (req, res, next) => {
    const { title, author, category, rating, review, status } = req.body;

    let coverImageUrl = null;
    let coverImageId = null;


    if (req.file) {
        coverImageUrl = req.file.path; // Cloudinary URL
        coverImageId = req.file.filename;
    }

    const book = await Book.create({
        title,
        author,
        category,
        coverImage: coverImageUrl,
        coverImageId,
        rating,
        review,
        status,
        user: req.user.id,
    });

    res.status(201).json({
        message: `${book.title} added successfully`,
        book,
    });
});

//User : update book by id
const editBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, author, category, rating, review, status } = req.body;

    const book = await Book.findOne({ _id: id, user: req.user.id });
    if (!book) {
        throw new NotFoundError("Book not found or not authorized");
    }

    // If new cover uploaded, replace old one in Cloudinary
    if (req.file) {
        if (book.coverImageId) {
            await cloudinary.uploader.destroy(book.coverImageId);
        }
        book.coverImage = req.file.path; // Cloudinary URL
        book.coverImageId = req.file.filename;
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (category !== undefined) book.category = category;
    if (rating !== undefined) {
        book.rating = rating === "0" || rating === 0 ? null : rating;
    }
    if (review !== undefined) book.review = review;
    if (status !== undefined) book.status = status;

    const updatedBook = await book.save();

    res.status(200).json({
        message: `${updatedBook.title} updated successfully`,
        book: updatedBook,
    });
});

//User : delete book by id
const deleteBook = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
        throw new NotFoundError("Book not found");
    }

    // Check ownership OR admin
    if (book.user.toString() !== req.user.id && req.user.role !== "admin") {
        throw new NotFoundError("Not authorized to delete this book");
    }

    // Delete image from Cloudinary if exists
    if (book.coverImageId) {
        await cloudinary.uploader.destroy(book.coverImageId);
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: `${book.title} deleted successfully` });
});


//Admin : get all books for all users
const getAllBooks = asyncHandler(async (req, res) => {
    let {
        page = 1,
        limit = 20,
        userId,
        search,
        sortBy = "createdAt",
        order = "desc",
        category
    } = req.query;

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    // ----------filter and sort ----------
    const filter = await bookFilter({ userId, search, category });
    const sortOpt = sortOption(sortBy, order);

    // ---------- Fetch Data ----------
    const totalBooks = await Book.countDocuments(); // all books in DB
    const allFilteredBooks = await Book.find(filter).select('category rating review');
    const stats = calcBookStats(allFilteredBooks);

    const books = await Book.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortOpt)
        .populate("user", "fullName email");

    const totalPages = Math.ceil(stats.total / limit);
    // ---------- Respond ----------
    res.status(200).json({
        page,
        limit,
        total: stats.total,
        totalPages,
        sortBy,
        order,
        stats,
        books,
        totalBooks
    });
});

module.exports = {
    getBooks,
    getBook,
    addBook,
    editBook,
    deleteBook,
    getAllBooks
}