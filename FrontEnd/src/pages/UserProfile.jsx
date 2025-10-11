import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { Loader } from "../components/common/Loader";
import { Button } from "../components/common/Button";
import { Input } from '../components/common/Input';
import toast from "react-hot-toast";
import { getInitials } from "../utils/helpers";

export default function ProfilePage () {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
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
            setImagePreview(data.profilePic);
        } catch (err) {
            toast.error(err.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        // display image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload image
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('profilePic', file);
            
            const updated = await userService.uploadProfilePicture(formData);
            setProfile(updated);
            toast.success("Profile picture updated successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update profile picture");
            setImagePreview(profile.profilePic);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        try {
            setUploading(true);
            const updated = await userService.removeProfilePicture();
            setProfile(updated);
            setImagePreview(null);
            toast.success("Profile picture removed");
        } catch (err) {
            toast.error(err.message || "Failed to remove profile picture");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updated = await userService.updateProfile({
                firstName,
                lastName,
                email,
            });
            setProfile(updated);
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="bg-gradient-to-br from-dark to-gray-500 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-dark via-secondary to-dark text-white p-8">
                        <h1 className="text-4xl font-bold">Hello, {firstName}</h1>
                        <p className="mt-2 text-blue-100">Manage your account settings</p>
                    </div>

                    <div className="p-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg ring-4 ring-white">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt={firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white">
                                            <span className="text-5xl font-semibold">
                                                {getInitials(firstName)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                     onClick={() => fileInputRef.current?.click()}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>

                                {uploading && (
                                    <div className="absolute inset-0 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            <div className="mt-4 flex gap-3">
                                <Button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {imagePreview ? 'Change' : 'Upload Photo'}
                                </Button>
                                
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        disabled={uploading}
                                        variant=""
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                            
                            <p className="mt-2 text-sm text-gray-500">
                                JPG,JPEG,PNG or WebP (max. 5MB)
                            </p>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="First Name :"
                                    type="text"
                                    placeholder="Enter first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    
                                    required
                                />
                                <Input
                                    label="Last Name :"
                                    type="text"
                                    placeholder="Enter last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    
                                    required
                                />
                            </div>

                            <Input
                                label="Full Name :"
                                type="text"
                                value={`${firstName} ${lastName}`}
                                className="w-full bg-gray-50"
                                disabled
                            />

                            <Input
                                label="Email Address :"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 sm:flex-none"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/users/change-password")}
                                    className="flex-1 sm:flex-none"
                                >
                                    Change Password
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/dashboard")}
                                    className="flex-1 sm:flex-none"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};