/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { Loader } from "../components/common/Loader";
import { Button } from "../components/common/Button";
import { Input } from '../components/common/Input';
import toast from "react-hot-toast";

export const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Editable fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
        } catch (err) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updated = await userService.updateProfile({
                firstName,
                lastName,
                email,
            });
            setProfile(updated);
            toast.success("Profile updated successfully");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6"> Welcome <span className="text-primary"> {profile.firstName} </span></h1>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <Input
                            label={"First Name"}
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                        <Input
                            label={"Last Name"}
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Last Name"
                            value={`${firstName} ${lastName}`}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border rounded p-2 bg-gray-100"
                            disabled
                        />
                        <Input
                            label={"Email"}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />

                        <div className="flex space-x-3">
                            <Button type="submit">Save Changes</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/change-password")}
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
