import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BaseModal } from "../../components/common/BaseModal";
import { FiMail, FiUser, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { msgService } from "../../services/msgService";

export default function MsgDetailsModal({ message, onClose }) {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (!message?._id) return;

        const fetchMsg = async () => {
            try {
                setLoading(true);
                setMsg(message); 
            } catch (error) {
                toast.error(error.message || "Failed to fetch message");
            } finally {
                setLoading(false);
            }
        };

        fetchMsg();
    }, [message]);

    const handleMarkAsRead = async () => {
        try {
            await msgService.markAsRead(message._id);
            toast.success("Message marked as read");
            setMsg({ ...msg, read: true });
        } catch (err) {
            toast.error("Failed to mark as read");
            console.log(err)
        }
    };

    if (!msg) return null;

    return (
        <BaseModal
            isOpen={!!message}
            onClose={onClose}
            size="md"
            showCloseButton={true}
            closeOnBackdrop={true}
            closeOnEsc={true}
            title= {msg.subject}
        >
            <div className="p-4 space-y-4 text-gray-700">
                {loading ? (
                    <p className="text-center text-gray-500">Loading message...</p>
                ) : (
                    <>
                        {/* Sender Info */}
                        <div className="flex items-center space-x-2">
                            <FiUser className="text-primary" />
                            <p className="font-medium">{msg.name}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <FiMail className="text-primary" />
                            <p>{msg.email}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <FiCalendar className="text-primary" />
                            <p>{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Message Body */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">Message:</h3>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        </div>

                        {/* Mark as Read Button */}
                        {!msg.read && (
                            <div className="text-right mt-6">
                                <button
                                    onClick={handleMarkAsRead}
                                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ml-auto"
                                >
                                    <FiCheckCircle className="mr-2" />
                                    Mark as Read
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </BaseModal>
    );
}
