
const Book = require("../models/booksModel");

// User : get user's own books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id });
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//User : get user's own book by id
const getBook = async (req, res, next) => {
    const { id } = req.params
    try {
        const book = await Book.findOne({ _id: id, user: req.user.id })
        if (!book) {
            return res.status(404).json({ message: "Book not found or not authorized" });
        }
        res.status(200).json(book)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//User : add book
const addBook = async (req, res, next) => {
    const { title, author,category ,coverImage, rating, review } = req.body;
    try{
        const book = await Book.create({
            title,
            author,
            category,
            coverImage,
            rating,
            review,
            user: req.user.id
        })
        res.status(201).json(`${book.title} added successfully`+book, null, 2)

    }catch (err) {
        res.status(500).json({ message: err.message })
    }
    
}

//User : update book by id
const editBook = async (req, res, next) => {
    const { id } = req.params
    const { title, author, category, coverImage, rating, review } = req.body;
    try {
        const book = await Book.findOne({ _id: id, user: req.user.id })
        if (!book) {
            return res.status(404).json({ message: "Book not found or not authorized" });
        }

        book.title = title;
        book.author = author;
        book.category = category;
        book.coverImage = coverImage;
        book.rating = rating;
        book.review = review;
        const updatedBook = await book.save();

        res.status(200).json(`${updatedBook.title} updated successfully`+updatedBook, null, 2);
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//User : delete book by id
const deleteBook = async (req, res, next) => {
    const { id } = req.params
    try {
        const book = await Book.findOneAndDelete({ _id: id, user: req.user.id })
        if (!book) {
            return res.status(404).json({ message: "Book not found or not authorized" });
        }
        res.status(200).json(`${book.title} deleted successfully`)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
}

//Admin : get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        if (!books) {
            return res.status(404).json({ message: "No books found" });
        }
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getBooks,
    getBook,
    addBook,
    editBook,
    deleteBook,
    getAllBooks
}
