import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { FiStar, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBook = async () => {
        try {
            const data = await bookService.getBook(id);
            setBook(data);
        } catch (error) {
            toast.error('Book not found',error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            await bookService.deleteBook(id);
            toast.success('Book deleted successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to delete book',error);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FiStar
                key={i}
                size={24}
                className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    if (loading) return <Loader />;
    if (!book) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6">
                    <FiArrowLeft className="inline mr-2" />
                    Back to Library
                </Button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Book Cover */}
                        <div className="md:w-1/3 bg-gray-200">
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center">
                                    <span className="text-9xl">📚</span>
                                </div>
                            )}
                        </div>

                        {/* Book Info */}
                        <div className="md:w-2/3 p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                                        {book.category}
                                    </span>
                                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                                    <p className="text-xl text-gray-600 mb-4">
                                        by {book.author || 'Unknown Author'}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            {book.rating && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-600 mb-2">Rating</p>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(book.rating)}
                                        <span className="ml-2 text-lg font-semibold">{book.rating}/5</span>
                                    </div>
                                </div>
                            )}

                            {/* Review */}
                            {book.review && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-600 mb-2">My Review</p>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {book.review}
                                    </p>
                                </div>
                            )}

                            {/* Date Added */}
                            <p className="text-sm text-gray-500 mb-6">
                                Added on {formatDate(book.createdAt)}
                            </p>

                            {/* Actions */}
                            <div className="flex space-x-3">
                                <Button onClick={() => navigate(`/dashboard?edit=${book._id}`)}>
                                    <FiEdit className="inline mr-2" />
                                    Edit Book
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    <FiTrash2 className="inline mr-2" />
                                    Delete Book
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
