import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const sendMessage = async (message, chatId) => {
    const response = await api.post('/api/chats/messages', { message, chat: chatId }, {
        headers: getAuthHeaders(),
    });
    return response.data;
};
export const getChats = async () => {
    const response = await api.get('/api/chats', {
        headers: getAuthHeaders(),
    });
    return response.data;
};
export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};
export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/${chatId}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}