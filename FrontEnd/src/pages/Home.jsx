import { Link } from 'react-router-dom';
import { FiBookOpen, FiStar, FiImage, FiBarChart2 } from 'react-icons/fi';
import { authService } from '../services/authService';

export const Landing = () => {
    const isAuthenticated = authService.isAuthenticated();
    const features = [
        {
            icon: FiBookOpen,
            title: 'Organize Your Library',
            description: 'Keep track of all your books in one place with easy organization'
        },
        {
            icon: FiStar,
            title: 'Rate & Review',
            description: 'Rate your books and write detailed reviews to remember your thoughts'
        },
        {
            icon: FiImage,
            title: 'Upload Book Covers',
            description: 'Add beautiful cover images to make your library visually appealing'
        },
        {
            icon: FiBarChart2,
            title: 'Track Your Reading',
            description: 'View statistics and insights about your reading habits'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-[url('Home.jpeg')] bg-cover bg-center text-white py-40  ">

                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Track Your Reading Journey
                    </h1>
                    <p className="text-xl md:text-2xl mb-8  max-w-3xl mx-auto">
                        Organize your books, rate them, write reviews, and build your personal library
                    </p>
                    {!isAuthenticated && (
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                            >
                                Join Us!
                            </Link>
                            <Link
                                to="/login"
                                className="bg-white text-dark hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                            >
                                Login
                            </Link>
                        </div>
                    )}

                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-dark">
                        Everything You Need to Track Your Books
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                            >
                                <feature.icon className="text-primary mb-4" size={48} />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* bottom Section */}
            <section className="bg-gradient-to-br from-dark via-secondary to-dark text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Start Your Reading Journey?
                    </h2>
                    {!isAuthenticated ? (
                        <>
                            <p className="text-xl mb-8 opacity-90">
                                Join thousands of readers organizing their libraries
                            </p>
                            <Link
                                to="/register"
                                className="bg-white/5 text-white hover:bg-white/10 px-6 py-4 rounded-lg text-lg font-semibold inline-block "
                            >
                                Create Your Free Account
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/dashboard"
                            className="bg-white/5 text-white hover:bg-white/10 px-6 py-4 rounded-lg text-lg font-semibold inline-block "
                        >
                            Proceed to Dashboard
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <FiBookOpen className="text-primary" size={24} />
                        <span className="text-xl font-bold">BOOK<span className="text-primary">TRACKER</span></span>
                    </div>
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} BookTracker. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};