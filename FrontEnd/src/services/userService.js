import api from './api';

export const userService = {
    //all methods return a promise
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
    
    uploadProfilePicture: async (formData) => {
        const response = await api.patch('/users/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    removeProfilePicture: async () => {
        const response = await api.patch('/users/me', {
            removeProfilePic: true
        });
        return response.data;
    },
        // Admin: Get all users   ====>>  toDo
    getAllUsers: async () => {
        const response = await api.get('/users/all');
        return response.data;
    },

    deleteUser: async (Id) => {
        const response = await api.delete(`/users/${Id}`);
        return response.data;
    },

    banUser: async (Id, isBanned) => {
        const response = await api.patch(`/users/ban/${Id}`, { isBanned });
        return response.data;
    },
    changeRole: async (Id, role) => {
        const response = await api.patch(`/users/role/${Id}`, { role });
        return response.data;
    },
};
