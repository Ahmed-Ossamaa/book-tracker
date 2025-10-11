import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';

// Lazy-loaded pages
const Landing = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ProfilePage = lazy(() => import('../pages/UserProfile'));
const ChangePassword = lazy(() => import('../pages/ChangePassowrd'));
const BookDetails = lazy(() => import('../pages/BookDetails'));
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AllBooks = lazy(() => import('../pages/Admin/AllBooks'));
const AllUsers = lazy(() => import('../pages/Admin/AllUsers'));
const AdminStats = lazy(() => import('../pages/Admin/AdminStats'));
const About = lazy(() => import('../pages/About'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const AdminMsgs = lazy(() => import('../pages/Admin/AdminMsgs'));


// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return !user ? children : <Navigate to="/dashboard" />;
};




export default function AppRoutes() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact-us" element={<ContactUs />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
                    <Route path="/users/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/users/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />


                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="books" element={<AllBooks />} />
                        <Route path="users" element={<AllUsers />} />
                        <Route path="stats" element={<AdminStats />} />
                        <Route path="messages" element={<AdminMsgs />} />
                    </Route>

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </>
    );
}