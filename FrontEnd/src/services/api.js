import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle unauthorized error
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle network error
        if (!error.response) {
            console.warn('Network error detected:', error.message);

            // Retry once after 1 second
            if (!error.config._retry) {
                error.config._retry = true;
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return axiosInstance(error.config);
            }

            console.error('Sever is unreachable.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;