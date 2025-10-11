import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bookService } from "../../services/bookService";
import { BaseModal } from "../../components/common/BaseModal";
import { formatDate } from "../../utils/helpers";
import {
    FiShield,
    FiBook,
    FiCheckCircle,
    FiXCircle,
    FiChevronLeft,
    FiChevronRight,
    FiUser
} from "react-icons/fi";
import { IoMdLogIn } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";


export default function UserDetailsModal  ({ user, onClose })  {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 6;

    useEffect(() => {
        if (!user) return;

        const fetchBooks = async () => {
            try {
                setLoading(true);
                const data = await bookService.getAllBooks(page, limit, { userId: user._id });
                setBooks(data.books || []);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            } catch (error) {
                toast.error(error.message || "Failed to fetch user books");
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [user, page]);

    // const totalPages = Math.ceil(total / limit);

    return (
        <BaseModal
            isOpen={!!user}
            onClose={onClose}
            size="lg"
            showCloseButton={true}
            closeOnBackdrop={true}
            closeOnEsc={true}
            title={
                <>
                    {user?.fullName}{" "} <span className="text-xs  text-gray-200">#{user?._id}</span>
                </>
            }
        
        >

            {/* User Details Cards */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    {/* Role */}
                    <div className="flex items-center gap-3 pl-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiShield className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                            <p className="font-semibold text-gray-900 capitalize">{user?.role || 'User'}</p>
                        </div>
                    </div>
                    {/* Join Date */}
                    <div className="flex items-center gap-3 pl-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <IoMdLogIn className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Join Date</p>
                            <p className="font-semibold text-gray-900 ">{formatDate(user?.createdAt) || 'User'}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3 pl-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${user?.isBanned ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                            {user?.isBanned ? (
                                <FiXCircle className="text-red-600" size={20} />
                            ) : (
                                <FiCheckCircle className="text-green-600" size={20} />
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                            <p className={`font-semibold ${user?.isBanned ? 'text-red-600' : 'text-green-600'}`}>
                                {user?.isBanned ? 'Banned' : 'Active'}
                            </p>
                        </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-3 pl-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <HiOutlineMail className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                            <a className="text-gray-900 underline hover:text-primary " href={`mailto:${user?.email}`}>{user?.email || 'User'}</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Books Section */}
            <div className="p-6 ">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FiBook className="text-primary" size={24} />
                        <h3 className="text-xl font-bold text-gray-900">User's Books</h3>
                    </div>
                    <span className="px-3 py-1 bg-dark/10 text-primary rounded-full text-sm font-semibold">
                        {total} {total === 1 ? 'Book' : 'Books'}
                    </span>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-gray-500">Loading books...</p>
                    </div>
                ) : books.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiBook size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No books found</p>
                        <p className="text-gray-400 text-sm">This user hasn't added any books yet.</p>
                    </div>
                ) : (
                    /* Books */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {books.map((book) => (
                            <div
                                key={book._id}
                                className="group p-4 border border-gray-300 rounded-lg  hover:shadow-md "
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 ">
                                        <FiBook className="text-primary" size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate capitalize underline ">
                                            {book.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 truncate">
                                            by {book.author || 'Unknown Author'}
                                        </p>
                                        {book.category && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100  text-xs rounded-full">
                                                {book.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && books.length > 0 && totalPages > 1 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed "
                            >
                                <FiChevronLeft size={16} />
                                <span className="font-medium">Previous</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
                                    <span className="font-semibold text-gray-900">{totalPages}</span>
                                </span>
                            </div>

                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed "
                            >
                                <span className="font-medium">Next</span>
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};