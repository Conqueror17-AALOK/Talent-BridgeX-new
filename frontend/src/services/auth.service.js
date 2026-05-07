import api from '../lib/api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.session) {
      localStorage.setItem('tbx_token', response.data.session.access_token);
      localStorage.setItem('tbx_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (formData) => {
    const response = await api.post('/auth/register', formData);
    if (response.data.session) {
      localStorage.setItem('tbx_token', response.data.session.access_token);
      localStorage.setItem('tbx_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('tbx_token');
    localStorage.removeItem('tbx_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('tbx_user');
    return user ? JSON.parse(user) : null;
  }
};
