import api from './api';

export const bookService = {
    // Get user's books with pagination
    getBooks: async (page = 1, limit = 12, category) => {
        let query = `?page=${page}&limit=${limit}`;
        if (category) {
            query += `&category=${category}`;
        }
        const response = await api.get(`/books${query}`);
        return response.data;
    },

    // Get single book
    getBook: async (id) => {
        const response = await api.get(`/books/${id}`);
        return response.data;
    },

    // Add new book
    addBook: async (bookData) => {
        const formData = new FormData();
        Object.keys(bookData).forEach(key => {
            if (bookData[key] !== null && bookData[key] !== undefined) {
                formData.append(key, bookData[key]);
            }
        });

        const response = await api.post('/books', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Update book
    updateBook: async (id, bookData) => {
        const formData = new FormData();
        Object.keys(bookData).forEach(key => {
            if (bookData[key] !== null && bookData[key] !== undefined) {
                formData.append(key, bookData[key]);
            }
        });
        console.log("Received from form:", bookData.status);
        const response = await api.patch(`/books/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete book
    deleteBook: async (id) => {
        const response = await api.delete(`/books/${id}`);
        return response.data;
    },

    // Admin: Get all books
    getAllBooks: async (page = 1, limit = 12, { search = "", sortBy = "createdAt", order = "desc", userId = "", category } = {}) => {
        let query = `?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`;
        if (search) query += `&search=${search}`;
        if (userId) query += `&userId=${userId}`;
        if (category) query += `&category=${category}`;
        const response = await api.get(`/books/all${query}`);
        return response.data;
    },


    // Admin: Get books for a specific user
    // getUserBooks: async (userId, page = 1, limit = 12) => {
    //     const response = await api.get(`/books/user/${userId}?page=${page}&limit=${limit}`);
    //     return response.data;
    // },

};