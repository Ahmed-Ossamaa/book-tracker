import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { BookCard } from '../components/books/BookCard';
import { BookForm } from '../components/books/BookForm';
import { StatsCard } from '../components/books/StatsCard';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { FiPlus, FiBookOpen, FiStar, FiEdit } from 'react-icons/fi';
import { getInitials } from '../utils/helpers';
import { BOOK_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';

export const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchBooks();
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    };

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getBooks(pagination.page, pagination.limit);
            setBooks(data.books);
            setPagination(prev => ({ ...prev, total: data.total }));
        } catch (error) {
            toast.error('Failed to fetch books', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (bookData) => {
        try {
            await bookService.addBook(bookData);
            toast.success('Book added successfully!');
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add book');
            throw error;
        }
    };

    const handleEditBook = async (bookData) => {
        try {
            await bookService.updateBook(editingBook._id, bookData);
            toast.success('Book updated successfully!');
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update book');
            throw error;
        }
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            await bookService.deleteBook(id);
            toast.success('Book deleted successfully!');
            fetchBooks();
        } catch (error) {
            toast.error('Failed to delete book', error);
        }
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBook(null);
    };

    const filteredBooks = selectedCategory === 'All'
        ? books
        : books.filter(book => book.category === selectedCategory);

    const totalBooks = books.length;
    const booksWithReviews = books.filter(b => b.review).length;
    const averageRating = books.length > 0
        ? (books.reduce((sum, b) => sum + (b.rating || 0), 0) / books.length).toFixed(1)
        : 0;

    if (loading && books.length === 0) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header Section */}
            <div className="bg-gradient-to-r from-dark via-secondary to-dark text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center space-y-8">
                        {/* User Info */}
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-2">{user?.fullName}</h1>
                            <p className="text-gray-300">{user?.email}</p>
                        </div>

                        {/* Stats Grid with Avatar in Center */}
                        <div className="relative flex items-center justify-center gap-8 max-w-5xl w-full">
                            {/* Left Side - 2 Cards */}
                            <div className="grid grid-cols-1 gap-4 flex-1">
                                <StatsCard
                                    icon={FiBookOpen}
                                    label="Own Books"
                                    value={totalBooks}
                                    color="primary"
                                />
                                <StatsCard
                                    icon={FiBookOpen}
                                    label="Want to Read"
                                    value={totalBooks}
                                    color="green"
                                />
                            </div>

                            {/* Center - Profile Picture */}
                            <div className="flex-shrink-0">
                                <div className="w-40 h-40 rounded-full bg-secondary flex items-center justify-center  font-bold ">
                                    {profile?.profilePic ? (
                                        <img
                                            src={profile.profilePic}
                                            alt={profile.firstName}
                                            className=" rounded-full object-cover shadow"
                                        />
                                    ) : (
                                        <div className="w-40 h-40 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {getInitials(profile?.firstName || "User")}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side - 2 Cards */}
                            <div className="grid grid-cols-1 gap-4 flex-1">
                                <StatsCard
                                    icon={FiEdit}
                                    label="Reviews"
                                    value={booksWithReviews}
                                    color="purple"
                                />
                                <StatsCard
                                    icon={FiStar}
                                    label="Avg Rating"
                                    value={averageRating}
                                    color="yellow"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Section */}
            <div className="container mx-auto px-4 py-8">
                {/* Header with Add Button */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                    <h2 className="text-2xl font-bold">My Library</h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <FiPlus className="inline mr-2" />
                        Add New Book
                    </Button>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-4 py-2 rounded-full transition ${selectedCategory === 'All'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        All ({totalBooks})
                    </button>
                    {BOOK_CATEGORIES.map(category => {
                        const count = books.filter(b => b.category === category).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full transition ${selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {category} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-16">
                        <FiBookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {selectedCategory === 'All' ? 'No books yet' : `No ${selectedCategory} books`}
                        </h3>
                        <p className="text-gray-500 mb-6">Start building your library!</p>
                        <Button onClick={() => setIsModalOpen(true)}>
                            Add Your First Book
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map(book => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                    onEdit={openEditModal}
                                    onDelete={handleDeleteBook}
                                    onView={(id) => navigate(`/books/${id}`)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.total > pagination.limit && (
                            <div className="flex justify-center items-center space-x-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-gray-600">
                                    Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Book Form Modal */}
            <BookForm
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={editingBook ? handleEditBook : handleAddBook}
                initialData={editingBook}
                isEdit={!!editingBook}
            />
        </div>
    );
};