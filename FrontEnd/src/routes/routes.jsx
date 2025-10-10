import { Navbar } from '../components/layout/Navbar';
import { Landing } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { ProfilePage } from '../pages/UserProfile';
import { ChangePassword } from '../pages/ChangePassowrd';
import { BookDetails } from '../pages/BookDetails';
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { AllBooks } from '../pages/Admin/AllBooks';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AllUsers } from '../pages/Admin/AllUsers';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

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


const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return user && isAdmin() ? children : <Navigate to="/dashboard" />;
};

export default function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

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
                    {/* <Route path="stats" element={<AdminStats />} /> */}
                </Route>

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}