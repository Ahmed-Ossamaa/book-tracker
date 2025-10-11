const { User } = require('../models/usersModel');
const { NotFoundError } = require('../utils/ApiError');

//book Filter
async function bookFilter({ _Id, search, category }) {
    const filter = {};

    if (_Id) {
        const user = await User.findById(_Id);
        if (!user) throw new NotFoundError(`User with id ${_Id} not found`);
        filter.user = _Id;
    }

    if (search) {
        const regex = new RegExp(search, "i");
        filter.$or = [
            { title: regex },
            { author: regex },
            { category: regex },
        ];
    }

    if (category && category !== "All") {
        filter.category = category;
    }

    return filter;
}

// Sort Option
function sortOption(sortBy, order) {
    return { [sortBy]: order === "asc" ? 1 : -1 };
}

// Calc Stats
function calcBookStats(books) {
    const total = books.length;
    let totalRating = 0;
    let withReviews = 0;
    const byCategory = {};

    books.forEach(book => {
        if (book.review && book.review.trim() !== "") withReviews++;
        if (book.rating) totalRating += book.rating;
        if (book.category) {
            byCategory[book.category] = (byCategory[book.category] || 0) + 1;
        }
    });

    const averageRating = total > 0 ? (totalRating / total).toFixed(1) : 0;

    return { total, withReviews, averageRating, byCategory };
}

module.exports = {
    bookFilter,
    sortOption,
    calcBookStats
};
