
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
import { ConfirmDialog } from '../components/common/confirmationDial';
import { useCallback } from 'react';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ total: 0, withReviews: 0, averageRating: 0, byCategory: {} });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [readStatus, setReadStatus] = useState(0);



    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    };

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await bookService.getBooks(
                pagination.page,
                pagination.limit,
                selectedCategory !== 'All' ? selectedCategory : undefined
            );
            setBooks(data.books);
            setPagination(prev => ({ ...prev, total: data.total }));
            console.log(data.stats.total);
            setStats(data.stats); // Update stats from backend
            setReadStatus(data.stats.status);
            console.log(data.stats.status);
        } catch (err) {
            toast.error(err.message || "Failed to load books");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, selectedCategory]);

    useEffect(() => {
        fetchBooks();

    }, [fetchBooks]);

    const handleAddBook = async (bookData) => {
        try {
            await bookService.addBook(bookData);
            toast.success('Book added successfully!');
            fetchBooks(); // This will refresh both books and stats
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add book');
            throw error;
        }
    };

    const handleEditBook = async (bookData) => {
        try {
            await bookService.updateBook(editingBook._id, bookData);
            toast.success('Book updated successfully!');
            fetchBooks(); // This will refresh both books and stats
        } catch (error) {
            toast.error('Failed to update book');
            throw error;
        }
    };
    const handleRateBook = async (bookId, rating) => {
        try {
            const data = await bookService.updateBook(bookId, { rating });
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book._id === bookId ? data.book : book
                )
            );
        } catch (error) {
            toast.error('Failed to rate book');
            console.error(error);
        }
    };

    const handleDeleteBook = (book) => {
        setBookToDelete(book);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete) return;

        try {
            await bookService.deleteBook(bookToDelete._id);
            toast.success('Book deleted successfully!');

            fetchBooks();
        } catch (err) {
            toast.error(err.message || 'Failed to delete book');
        } finally {
            setIsDeleteDialogOpen(false);
            setBookToDelete(null);
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

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
    };

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
                        <div className="relative flex items-center justify-center gap-8  w-full">
                            {/* Left Side - 2 Cards */}
                            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 flex-1 ">
                                <StatsCard
                                    icon={FiBookOpen}
                                    label="Own Books"
                                    value={stats.total}
                                    color="primary"
                                />
                                <StatsCard
                                    icon={FiEdit}
                                    label="Reviews"
                                    value={stats.withReviews}
                                    color="purple"
                                />
                                <StatsCard
                                    icon={FiStar}
                                    label="Avg Rating"
                                    value={stats.averageRating}
                                    color="yellow"
                                />

                            </div>

                            {/* Center - Profile Picture */}
                            <div className="flex-shrink-0">
                                <div className="w-40 h-40 rounded-full bg-secondary flex items-center justify-center font-bold">
                                    {profile?.profilePic ? (
                                        <img
                                            src={profile.profilePic}
                                            alt={profile.firstName}
                                            onClick={() => navigate('/users/profile')}
                                            className="w-40 h-40 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-40 h-40 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {getInitials(profile?.firstName || "User")}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side - 2 Cards */}
                            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                <StatsCard
                                    icon={FiBookOpen}
                                    label="Read"
                                    value={stats.status.read}
                                    color="green"
                                />
                                <StatsCard
                                    icon={FiBookOpen}
                                    label=" To Read"
                                    value={stats.status.toRead}
                                    color="purple"
                                />
                                <StatsCard
                                    icon={FiBookOpen}
                                    label="Reading"
                                    value={stats.status.reading}
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
                <div className="mb-6">
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700  "
                    >
                        <option value="All">
                            All ({stats.total})
                        </option>

                        {BOOK_CATEGORIES.map(category => {
                            const count = stats.byCategory[category] || 0;
                            if (count === 0) return null;
                            return (
                                <option key={category} value={category}>
                                    {category} ({count})
                                </option>
                            );
                        })}
                    </select>
                </div>
                {/* Books Grid */}
                {books.length === 0 ? (
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
                            {books.map(book => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                    onEdit={openEditModal}
                                    onDelete={handleDeleteBook}
                                    onView={(id) => navigate(`/books/${id}`)}
                                    onRate={ handleRateBook}
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
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setBookToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${bookToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmColor="red"
            />
        </div>
    );
};