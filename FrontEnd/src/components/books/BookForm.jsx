import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { BOOK_CATEGORIES, RATINGS } from '../../utils/constants';
import { FiStar, FiUpload } from 'react-icons/fi';

export const BookForm = ({ isOpen, onClose, onSubmit, initialData, isEdit = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'Other',
        rating: null,
        review: '',
        coverImage: null
    });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                author: initialData.author || '',
                category: initialData.category || 'Other',
                rating: initialData.rating || null,
                review: initialData.review || '',
                coverImage: null
            });
            setPreview(initialData.coverImage || null);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, coverImage: 'File size must be less than 5MB' }));
                return;
            }
            setFormData(prev => ({ ...prev, coverImage: file }));
            setPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, coverImage: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 2) {
            newErrors.title = 'Title must be at least 2 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            author: '',
            category: 'Other',
            rating: null,
            review: '',
            coverImage: null
        });
        setPreview(null);
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? <>Edit <span className="text-blue-900 font-bold">{initialData.title}</span> Book</> : 'Add New Book'}>
            <form onSubmit={handleSubmit}>
                {/* Cover Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover</label>
                    <div className="flex items-center space-x-4">
                        {preview && (
                            <img src={preview} alt="Preview" className="w-24 h-32 object-cover rounded" />
                        )}
                        <label className="flex-1 flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100">
                            <FiUpload size={32} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">Click to upload cover image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
                </div>

                {/* Title */}
                <Input
                    label="Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    placeholder="Enter book title"
                />

                {/* Author */}
                <Input
                    label="Author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name (optional)"
                />

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {BOOK_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Rating */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-2">
                        {RATINGS.map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                className="focus:outline-none"
                            >
                                <FiStar
                                    size={32}
                                    className={`${star <= formData.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        } hover:text-yellow-400 transition`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                    <textarea
                        name="review"
                        value={formData.review}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Write your review..."
                    />
                </div>

                {/* Error Message */}
                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {errors.submit}
                    </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
};