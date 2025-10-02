import { FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { truncateText } from '../../utils/helpers';

export const BookCard = ({ book, onEdit, onDelete, onView, isAdmin = false }) => {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FiStar
                key={i}
                size={16}
                className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col">
            {/* Book Cover */}
            <div
                onClick={() => onView(book._id)}
                className="relative h-64 bg-gray-200 overflow-hidden"
            >
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                        <span className="text-dark text-6xl">📚</span>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                    {book.category}
                </div>
            </div>

            {/* Book Info */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{book.author || 'Unknown Author'}</p>

                {/* Rating */}
                {book.rating && (
                    <div className="flex items-center space-x-1 mb-2">
                        {renderStars(book.rating)}
                    </div>
                )}

                {/* Review Preview */}
                {book.review && (
                    <p className="text-gray-500 text-sm mb-3">
                        {truncateText(book.review, 80)}
                    </p>
                )}

                {/* Actions pinned to bottom */}
                <div className="mt-auto pt-3 border-t flex space-x-2">
                    {!isAdmin && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(book);
                            }}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                        >
                            <FiEdit2 size={16} />
                            <span className="text-sm">Edit</span>
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(book._id);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    >
                        <FiTrash2 size={16} />
                        <span className="text-sm">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

