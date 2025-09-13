import axios from 'axios';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('diskusi_forum_token');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
