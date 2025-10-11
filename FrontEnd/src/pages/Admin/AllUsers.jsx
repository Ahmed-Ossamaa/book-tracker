
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Loader } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiUser, FiShield, FiSlash, FiTrash2, FiSearch, FiChevronDown } from 'react-icons/fi';
import { FaEye } from "react-icons/fa";
import UserDetailsModal from './UserDetails';
export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openUser, setOpenUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);


    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-menu')) {
                setOpenUser(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMakeAdmin = async (userId, currentRole) => {
        const action = currentRole === 'admin' ? 'remove admin rights from' : 'make admin';
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            await userService.changeRole(userId, currentRole === 'admin' ? 'user' : 'admin');
            toast.success(`User ${currentRole === 'admin' ? 'removed from admin' : 'promoted to admin'} successfully!`);
            fetchAllUsers();
        } catch (error) {
            toast.error(error.message || 'Failed to update user role');
        }
    };

    const handleBanUser = async (userId, isBanned) => {
        const action = isBanned ? 'unban' : 'ban';
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            await userService.banUser(userId, !isBanned);
            toast.success(`User ${action}ned successfully!`);
            fetchAllUsers();
        } catch (error) {
            toast.error(error.message || `Failed to ${action} user`);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;

        try {
            await userService.deleteUser(userId);
            toast.success('User deleted successfully!');
            fetchAllUsers();
        } catch (error) {
            toast.error(error.message || 'Failed to delete user');
        }
    };

    // Search
    const filteredUsers = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-2">
                    Manage all registered users ({users.length} total)
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <FiUser size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">
                        {searchTerm ? 'No users found matching your search' : 'No users found'}
                    </h3>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 ">
                                <tr className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="py-3 px-10 ">
                                        User
                                    </th>
                                    <th className="py-3 px-6 ">
                                        Email
                                    </th>
                                    <th className="py-3 px-6 ">
                                        Role
                                    </th>
                                    <th className="py-3 px-6 ">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center ">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        {/* User Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <FiUser className="text-primary" size={20} />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 cursor-pointer hover:underline"
                                                        onClick={() => setSelectedUser(user)}>
                                                        {user.fullName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.role === 'admin' && <FiShield size={12} />}
                                                {user.role || 'User'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBanned
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.isBanned ? 'Banned' : 'Active'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative inline-block text-left">
                                                {/* Dropdown Trigger */}
                                                <button
                                                    onClick={() => setOpenUser(user._id === openUser ? null : user._id)}
                                                    className="inline-flex justify-center rounded-md border border-gray-300  px-2 py-1.5  hover:bg-gray-100 dropdown-menu"
                                                >
                                                    Actions
                                                    <FiChevronDown size={16} className="ml-1 mt-0.5" />
                                                </button>

                                                {/* Dropdown Items */}
                                                {openUser === user._id && (
                                                    <div className=" absolute right-0 mt-1 w-30 rounded-md bg-white border border-gray200 z-10">
                                                        <div className="py-1">
                                                            {/* View user detals */}
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                }}
                                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <FaEye className="inline mr-2 text-primary" size={14} />
                                                                View
                                                            </button>

                                                            {/* Toggle Role */}
                                                            <button onClick={() => handleMakeAdmin(user._id, user.role)}
                                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <FiShield className="inline mr-2 text-primary" size={14} />
                                                                {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                                                            </button>

                                                            {/* Ban / Unban */}
                                                            <button
                                                                onClick={() =>  handleBanUser(user._id, user.isBanned)}
                                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <FiSlash className="inline mr-2 text-yellow-500" size={14} />
                                                                {user.isBanned ? "Unban" : "Ban"}
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
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
                        {selectedUser && (
                            <UserDetailsModal
                                user={selectedUser}
                                onClose={() => setSelectedUser(null)}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Results Count */}
            {searchTerm && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            )}
        </div>
    );
};