import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { userService } from '../../services/userService';
import { StatsCard } from '../../components/books/StatsCard';
import { Loader } from '../../components/common/Loader';
import { FiBookOpen, FiUsers, FiTrendingUp, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { DashboardButton, OverviewRow, BookCard } from '../../components/adminDb/admindb';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        mostReadCategory: 'Loading...',
        recentBooks: []
    });

    // most popular category
    const getMostReadCategory = (books) => {
        const categoryCounts = books.reduce((acc, book) => {
            acc[book.category] = (acc[book.category] || 0) + 1;
            return acc;
        }, {});
        if (!Object.keys(categoryCounts).length) return 'No books yet';
        return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
    };

    // Fetch dashboard data
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);

            const [allBooks, latestBooks, usersData] = await Promise.all([
                bookService.getAllBooks(1, 999999, {}), // all for stats
                bookService.getAllBooks(1, 6, { sortBy: 'createdAt', order: 'desc' }), // latest books
                userService.getAllUsers()
            ]);

            setStats({
                totalBooks: allBooks.totalBooks || 0,
                totalUsers: usersData.length || 0,
                mostReadCategory: getMostReadCategory(allBooks.books || []),
                recentBooks: latestBooks.books || []
            });
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error('Dashboard error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-dark via-secondary to-dark text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-gray-300 mb-6">Overview of your platform</p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <StatsCard icon={FiUsers} label="Total Users" value={stats.totalUsers} color="" />
                        <StatsCard icon={FiBookOpen} label="Total Books" value={stats.totalBooks}  color=""/>
                        <StatsCard icon={FiTrendingUp} label="Most Popular Category" value={stats.mostReadCategory} color="" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/*cards*/}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardButton
                        onClick={() => navigate('/admin/books')}
                        icon={<FiBookOpen className="text-primary" size={32} />}
                        title="Manage Books"
                        subtitle="View and manage all books"
                        value={stats.totalBooks}
                    />
                    <DashboardButton
                        onClick={() => navigate('/admin/users')}
                        icon={<FiUsers className="text-primary" size={32} />}
                        title="Manage Users"
                        subtitle="View and manage all users"
                        value={stats.totalUsers}
                    />
                    <DashboardButton
                        onClick={() => navigate('/admin/stats')}
                        icon={<FiActivity className="text-primary" size={32} />}
                        title="Statistics"
                        subtitle="Detailed analytics and reports"
                        value="View Details"
                        isSmall
                    />
                </section>

                {/* Recent Books */}
                <section className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Books</h2>
                        <button
                            onClick={() => navigate('/admin/books')}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                            View All →
                        </button>
                    </div>

                    {stats.recentBooks.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No books available yet</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.recentBooks.map((book) => (
                                <BookCard key={book._id} book={book} onClick={() => navigate(`/books/${book._id}`)} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Overview */}
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Overview</h2>
                    <OverviewRow label="Total Books" value={stats.totalBooks} />
                    <OverviewRow label="Total Users" value={stats.totalUsers} />
                    <OverviewRow label="Most Popular Category" value={stats.mostReadCategory} noBorder />
                </section>
            </div>
        </div>
    );
};

