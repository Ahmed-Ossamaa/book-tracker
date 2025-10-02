import api from './api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;

    },

    updateProfile: async (userData) => {
        const response = await api.patch('/users/me', userData);
        return response.data;
    },

    updatePassword: async (passwordData) => {
        const response = await api.patch('/users/me/password', passwordData);
        return response.data;
    },
};
