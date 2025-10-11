import { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService';
import { Loader } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiBook, FiTrash2, FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BOOK_CATEGORIES } from '../../utils/constants';

export default function AllBooks() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openBook, setOpenBook] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAllBooks();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-menu')) {
                setOpenBook(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchAllBooks = async () => {
        try {
            setLoading(true);
            // Fetch ALL books at once 
            const data = await bookService.getAllBooks(1, 999999, {});
            setBooks(data.books || []);
            setTotalBooks(data.totalBooks || 0);
        } catch (error) {
            toast.error('Failed to fetch books');
            console.error('Error fetching books:', error);
            setBooks([]);
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
            toast.error('Failed to delete book');
            console.log(`Error deleting book: ${error}`);
        }
    };

    // filtering
    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'All' || book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // pagination
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 when searching
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1); // Reset to page 1 when filtering
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen px-6 py-8 bg-gray-100">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
                <p className="text-gray-600 mt-2">Browse and manage all books ({totalBooks} total)</p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="relative max-w-md w-full">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm "
                    >
                        <option value="All">All Categories</option>
                        {BOOK_CATEGORIES.map((category) => (
                            <option key={category} value={category} >
                                {category}
                            </option>
                        ))}

                    </select>
                </div>
            </div>

            {/* Books Table */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <FiBook size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">
                        {searchTerm || selectedCategory !== 'All' ? 'No books found matching your search' : 'No books found'}
                    </h3>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedBooks.map((book, i) => (
                                        <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {startIndex + i + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{book.title}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.author || 'Unknown'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                                                    {book.category || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {book.rating ? book.rating.toFixed(1) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="relative inline-block">
                                                    <button
                                                        onClick={() => setOpenBook(book._id === openBook ? null : book._id)}
                                                        className="inline-flex justify-center rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-100 dropdown-menu"
                                                    >
                                                        Actions
                                                        <FiChevronDown size={16} className="ml-1 mt-0.5" />
                                                    </button>
                                                    {openBook === book._id && (
                                                        <div className="absolute right-0 mt-1 w-30 rounded-md bg-white border border-gray-200 shadow-lg z-10">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() => navigate(`/books/${book._id}`)}
                                                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    <FaEye className="inline mr-2 text-primary" size={14} />
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteBook(book._id)}
                                                                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                                                >
                                                                    <FiTrash2 className="inline mr-2" size={14} />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-2 flex items-center justify-center gap-4">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                            >
                                <FiChevronLeft /> Previous
                            </button>
                            <span className="text-gray-600 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next <FiChevronRight />
                            </button>
                        </div>
                    )}

                    {/* Results Count */}
                    {(searchTerm || selectedCategory !== 'All') && (
                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredBooks.length} of {totalBooks} books
                        </div>
                    )}
                </>
            )}
        </div>
    );
};