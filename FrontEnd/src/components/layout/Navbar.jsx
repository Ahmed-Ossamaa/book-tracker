import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiBookOpen, FiLogOut, FiUser, FiShield, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

export const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-dark text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                        <FiBookOpen className="text-primary" size={28} />
                        <span>BOOK<span className="text-primary">TRACKER</span></span>
                    </Link>

                    {/* Navigation */}
                    {user ? (
                        <div className="flex items-center space-x-6">

                            <Link to="/" className="hover:text-primary transition">
                                Home
                            </Link>
                            <Link to="/dashboard" className="hover:text-primary transition">
                                My Library
                            </Link>

                            {isAdmin() && (
                                <Link to="/admin/dashboard" className="hover:text-primary transition flex items-center space-x-1">
                                    <FiShield size={18} />
                                    <span>Admin</span>
                                </Link>
                            )}

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 hover:text-primary transition"
                                >
                                    <FiUser size={20} />
                                    <span>{user.firstName}</span>
                                    <FiChevronDown size={16}  className='mt-0.5'/>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <button
                                            onClick={() => navigate("/users/profile")}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:text-primary flex items-center space-x-2"
                                        >
                                            <FiUser size={18} />
                                            <span>Profile</span>
                                            
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:text-danger flex items-center space-x-2"
                                        >
                                            <FiLogOut size={18} />
                                            <span>Logout</span>
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4 me-5">
                            <Link to="/login" className="hover:text-primary transition">
                                Login
                            </Link>
                            <Link to="/register" className="hover:text-primary transition">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};