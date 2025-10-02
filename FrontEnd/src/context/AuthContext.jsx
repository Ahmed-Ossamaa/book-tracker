import {  useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './context';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        const { token: _token, ...user } = data;
        setUser(user);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        const { token: _token, ...user } = data;
        setUser(user);
        return data;
    };
        const logout = () => {
            authService.logout();
            setUser(null);
        };

        const isAdmin = () => {
            return user?.role === 'admin';
        };

        return (
            <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
                {children}
            </AuthContext.Provider>
        );
};
