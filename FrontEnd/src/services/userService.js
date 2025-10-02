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
};
