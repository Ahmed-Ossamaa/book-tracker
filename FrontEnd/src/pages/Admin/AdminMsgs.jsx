import { useEffect, useState } from "react";
import { msgService } from "../../services/msgService";
import {
    FiEye,
    FiCheckCircle,
    FiTrash2,
    FiChevronDown,
    FiMail,
} from "react-icons/fi";
import MsgDetailsModal from "./MsgDetails";

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [openMsg, setOpenMsg] = useState(null);

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-menu')) {
                setOpenMsg(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const loadMessages = async () => {
        try {
            const data = await msgService.getMsgs();
            setMessages(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await msgService.deleteMsg(id);
            setMessages((prev) => prev.filter((m) => m._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await msgService.markAsRead(id);
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === id ? { ...m, isRead: !m.isRead } : m
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">User Messages</h1>
                <p className="text-gray-600 mt-2">
                    Manage and respond to user messages ({messages.length} total)
                </p>
            </div>

            {/* Messages Table */}
            {messages.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <FiMail size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">
                        No messages yet
                    </h3>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="py-3 px-10">Name</th>
                                    <th className="py-3 px-6">Email</th>
                                    <th className="py-3 px-6">Subject</th>
                                    <th className="py-3 px-6">Date</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {messages.map((msg) => (
                                    <tr
                                        key={msg._id}
                                        className={`hover:bg-gray-50 transition-colors ${
                                            msg.isRead ? "bg-gray-50" : ""
                                        }`}
                                    >
                                        {/* Name  */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {!msg.isRead && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                )}
                                                <div className={msg.isRead ? "text-sm text-gray-600" : "text-sm font-medium text-gray-900"}>
                                                    {msg.name}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{msg.email}</div>
                                        </td>

                                        {/* Subject */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{msg.subject}</div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative inline-block text-left">
                                                {/* Dropdown Trigger */}
                                                <button
                                                    onClick={() => setOpenMsg(msg._id === openMsg ? null : msg._id)}
                                                    className="inline-flex justify-center rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-100 dropdown-menu"
                                                >
                                                    Actions
                                                    <FiChevronDown size={16} className="ml-1 mt-0.5" />
                                                </button>

                                                {/* Dropdown Items */}
                                                {openMsg === msg._id && (
                                                    <div className="absolute right-0 mt-1 w-40 rounded-md bg-white border border-gray-200 shadow-lg z-10">
                                                        <div className="py-1">
                                                            {/* View */}
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedMsg(msg);
                                                                    setOpenMsg(null);
                                                                }}
                                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <FiEye className="inline mr-2 text-primary" size={14} />
                                                                View
                                                            </button>

                                                            {/* Mark as Read/Unread */}
                                                            <button
                                                                onClick={() => {
                                                                    handleMarkAsRead(msg._id);
                                                                    setOpenMsg(null);
                                                                }}
                                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <FiCheckCircle 
                                                                    className={`inline mr-2 ${msg.isRead ? 'text-yellow-600' : 'text-green-600'}`} 
                                                                    size={14} 
                                                                />
                                                                {msg.isRead ? "Mark as Unread" : "Mark as Read"}
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => {
                                                                    handleDelete(msg._id);
                                                                    setOpenMsg(null);
                                                                }}
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
                    </div>
                </div>
            )}

            {/* View Message Modal */}
            {selectedMsg && (
                <MsgDetailsModal
                    message={selectedMsg}
                    onClose={() => setSelectedMsg(null)}
                />
            )}
        </div>
    );
}