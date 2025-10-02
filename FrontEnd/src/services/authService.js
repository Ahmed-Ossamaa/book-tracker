import api from './api';

export const authService = {

    /**
     * Registers a new user with the provided userData.
     * If the API returns a token, it is stored in localStorage and the user object is created without the token and stored in localStorage.
     * @param {Object} userData - The new user's data.
     * @returns {Promise<Object>} The response data from the API.
     */

    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Create user object without token
            const { _id, firstName, lastName, fullName, email, role } = response.data;
            const user = { _id, firstName, lastName, fullName, email, role };
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },



    /**
     * Logs the user in by sending a request to the API's login endpoint.
     * If the response contains a token, it is stored in local storage along with the user object.
     * @param {Object}  -The user's credentials.
     * @returns {Promise<Object>} The response data from the API.
     */
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Create user object without token
            const { _id, firstName, lastName, fullName, email, role } = response.data;
            const user = { _id, firstName, lastName, fullName, email, role };
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },


/**
 * Logs the user out by removing their token and user object from local storage.
 */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },


/**
 * Returns the current user object from local storage, or null if the user is not logged in.
 * @returns {Object|null} The current user object, or null if the user is not logged in.
 */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined') {
            return null;
        }
        return JSON.parse(user);
    },

/**
 * Checks if the user is authenticated ( if a token exists in localStorage).
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

/**
 * Checks if the current user's role is admin.
 * @returns {boolean} True if the current user is an admin, false otherwise.
 */
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.role === 'admin';
    }
};