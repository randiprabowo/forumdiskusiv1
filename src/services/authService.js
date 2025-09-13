import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data?.data ?? response.data;
  },

  login: async (userData) => {
    const response = await api.post('/login', userData);
    return response.data?.data ?? response.data;
  },
};

export default authService;
