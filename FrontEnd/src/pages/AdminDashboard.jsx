import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookService } from '../services/bookService';
import { BookCard } from '../components/books/BookCard';
import { StatsCard } from '../components/books/StatsCard';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { FiBookOpen, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { BOOK_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/dashboard');
            return;
        }
        fetchAllBooks();
        // eslint-disable-next-line 
    }, [pagination.page]);

    const fetchAllBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getAllBooks(pagination.page, pagination.limit);
            setBooks(data.books);
            setPagination(prev => ({ ...prev, total: data.total }));
        } catch (error) {
            toast.error('Failed to fetch books', error);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteBook = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            await bookService.deleteBook(id);
            toast.success('Book deleted successfully!');
            fetchAllBooks();
        } catch (error) {
            toast.error('Failed to delete book', error);
        }
    };

    const filteredBooks = selectedCategory === 'All'
        ? books
        : books.filter(book => book.category === selectedCategory);

    // Calculate statistics
    const totalBooks = pagination.total;
    const uniqueUsers = new Set(books.map(b => b.user)).size;

    // Most read category
    const categoryCounts = books.reduce((acc, book) => {
        acc[book.category] = (acc[book.category] || 0) + 1;
        return acc;
    }, {});
    const mostReadCategory = Object.keys(categoryCounts).length > 0
        ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
        : 'No books read yet';

    if (loading && books.length === 0) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-dark via-secondary to-dark text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-300 mb-6">Manage all books across the platform</p>
                    </div>

                    {/* Admin Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <StatsCard
                            icon={FiUsers}
                            label="Total Users"
                            value={uniqueUsers}
                            color=""
                        />
                        <StatsCard
                            icon={FiBookOpen}
                            label="Total Books"
                            value={totalBooks}
                            color=""
                        />
                        <StatsCard
                            icon={FiTrendingUp}
                            label="Most Read"
                            value={mostReadCategory}
                            color=""
                        />
                    </div>
                </div>
            </div>

            {/* Books Section */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">All Books</h2>

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
                        <h3 className="text-xl font-semibold text-gray-600">No books found</h3>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map(book => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                    onDelete={  handleDeleteBook }
                                    onView={(id) => navigate(`/books/${id}`)}
                                    isAdmin={true}
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
        </div>
    );
};