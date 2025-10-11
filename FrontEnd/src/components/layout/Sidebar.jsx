import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu, FiX, FiHome, FiBook, FiUsers, FiBarChart2, FiLogOut, FiMessageSquare } from 'react-icons/fi';

export const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: FiHome, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: FiBook, label: 'All Books', path: '/admin/books' },
        { icon: FiUsers, label: 'All Users', path: '/admin/users' },
        { icon: FiBarChart2, label: 'Statistics', path: '/admin/stats' },
        { icon: FiMessageSquare, label: 'Messages', path: '/admin/messages' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    // Check if current path matches menu item
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Flowbite Sidebar */}
            <aside
                className={`fixed left-0 z-40 w-64 h-screen transition-transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-dark">
                    {/* Sidebar Header */}
                    <div className="mb-5 pb-4 border-b border-gray-700">
                        <h5 className="text-base font-semibold text-white uppercase">
                            Admin Panel
                        </h5>
                    </div>

                    {/* Sidebar Menu */}
                    <ul className="space-y-2 font-medium">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <li key={item.path}>
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-gray-800 group transition-colors ${
                                            active ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 transition duration-75 ${
                                            active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                                        }`} />
                                        <span className="ms-3">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Quick Actions Section (Optional) */}
                    <div className="pt-4 mt-4 border-t border-gray-700">
                        <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">
                            Quick Actions
                        </p>
                        <ul className="space-y-2 font-medium">
                            <li>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex items-center w-full p-2 text-white rounded-lg hover:bg-gray-800 group transition-colors"
                                >
                                    <FiHome className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-gray-200" />
                                    <span className="ms-3">User Dashboard</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Sidebar Footer - Logout */}
                    <div className="absolute bottom-4 left-0 right-0 px-3">
                        <button
                            onClick={logout}
                            className="flex items-center w-full p-2 text-white rounded-lg hover:bg-red-900 group transition-colors"
                        >
                            <FiLogOut className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-red-200" />
                            <span className="ms-3">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </>
    );
};