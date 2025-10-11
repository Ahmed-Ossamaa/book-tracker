import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { bookService } from "../../services/bookService";
import { userService } from "../../services/userService";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminStats() {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        booksPerCategory: {},
        booksPerMonth: {},
        usersPerMonth: {},
        totalUsers: 0,
        totalBooks: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            const [booksRes, usersRes] = await Promise.all([
                bookService.getAllBooks(1, 999999, {}),
                userService.getAllUsers(),
            ]);

            const books = booksRes.books || [];
            const users = usersRes || [];

            // the last 6 months labels
            const getLastMonths = (count = 6) => {
                const now = new Date();
                const months = [];
                for (let i = count - 1; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    months.push(`${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`);
                }
                return months;
            };

            const monthLabels = getLastMonths(6);

            // Books per category
            const categoryCounts = books.reduce((acc, book) => {
                acc[book.category] = (acc[book.category] || 0) + 1;
                return acc;
            }, {});

            // Books per month (last 6 months)
            const booksPerMonth = monthLabels.reduce((acc, label) => {
                acc[label] = 0;
                return acc;
            }, {});
            books.forEach((book) => {
                const date = new Date(book.createdAt);
                const label = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
                if (booksPerMonth[label] !== undefined) booksPerMonth[label]++;
            });

            // Users per month (last 6 months)
            const usersPerMonth = monthLabels.reduce((acc, label) => {
                acc[label] = 0;
                return acc;
            }, {});
            users.forEach((user) => {
                const date = new Date(user.createdAt);
                const label = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
                if (usersPerMonth[label] !== undefined) usersPerMonth[label]++;
            });

            setChartData({
                booksPerCategory: categoryCounts,
                booksPerMonth,
                usersPerMonth,
                totalUsers: users.length,
                totalBooks: books.length
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    const categoryLabels = Object.keys(chartData.booksPerCategory);
    const categoryValues = Object.values(chartData.booksPerCategory);

    const monthLabels = Object.keys(chartData.booksPerMonth);
    const bookMonthValues = Object.values(chartData.booksPerMonth);
    const userMonthValues = Object.values(chartData.usersPerMonth);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Admin Statistics
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Total Users */}
                    <div className="mt-10 bg-white rounded-lg shadow p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Total Registered Users
                        </h2>
                        <p className="text-4xl font-bold text-primary">
                            {chartData.totalUsers}
                        </p>
                    </div>
                    {/* Total Books */}
                    <div className="mt-10 bg-white rounded-lg shadow p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Total Books
                        </h2>
                        <p className="text-4xl font-bold text-primary">
                            {chartData.totalBooks}
                        </p>
                    </div>
                    {/* Books per Category */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Books per Category
                        </h2>
                        <Doughnut
                            data={{
                                labels: categoryLabels,
                                datasets: [
                                    {
                                        label: "Books",
                                        data: categoryValues,
                                        backgroundColor: [
                                            "#36A2EB",
                                            "#FF6384",
                                            "#FFCE56",
                                            "#4BC0C0",
                                            "#9966FF",
                                            "#FF9F40",
                                        ],
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                            }}
                        />
                    </div>

                    {/* Books Added per Month */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Books Added (Last 6 Months)
                        </h2>
                        <Bar
                            data={{
                                labels: monthLabels,
                                datasets: [
                                    {
                                        label: "Books Added",
                                        data: bookMonthValues,
                                        backgroundColor: "#36A2EB",
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                scales: { y: { beginAtZero: true } },
                            }}
                        />
                    </div>

                    {/* Users Registered per Month */}
                    <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Users Registered (Last 6 Months)
                        </h2>
                        <Bar
                            data={{
                                labels: monthLabels,
                                datasets: [
                                    {
                                        label: "Users Registered",
                                        data: userMonthValues,
                                        backgroundColor: "#FF9F40",
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: (value) => (Number.isInteger(value) ? value : null),
                                        }
                                    }
                                },
                            }}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
};
