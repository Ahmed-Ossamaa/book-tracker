import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { Loader } from "../components/common/Loader";
import { Button } from "../components/common/Button";
import { Input } from '../components/common/Input';
import toast from "react-hot-toast";

export default function ChangePassword  () {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [profile, setProfile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
            setCurrentPassword(data.currentPassword);
            setNewPassword(data.newPassword);
        } catch (err) {
            toast.error(err.message||"Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updated = await userService.updatePassword({
                currentPassword,
                newPassword
            })
            setProfile(updated);
            toast.success("Password updated successfully");
            navigate("/login");
            setCurrentPassword
        } catch (err) {
            toast.error(err.message || "Failed to update password");
        }
    }

    if (loading) return <Loader />;
    return (
        <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg ">
                <div className="flex items-center justify-center space-x-2 mb-8">
                    <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-1">Change your Password</h1>
                    <p className="text-gray-600 mb-5">Update your password to keep your account secure.</p>

                        <form onSubmit={handleUpdateProfile}>
                            <Input
                                type="password"
                                label="Current Password"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                            />
                            <Input
                                type="password"
                                label="New Password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <Button type="submit" className="mt-3">Update Password</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

