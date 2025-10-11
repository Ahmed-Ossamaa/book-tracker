import api from './api';

export const msgService = {

    sendMsg: async (msgData) => {
        const response = await api.post('/contact-us/message', msgData);
        return response.data;
    },

    getMsgs: async () => {
        const response = await api.get('/contact-us/messages');
        return response.data;
    },
    deleteMsg: async (id) => {
        const response = await api.delete(`/contact-us/message/${id}`);
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.patch(`/contact-us/message/${id}`);
        return response.data;
    },

}