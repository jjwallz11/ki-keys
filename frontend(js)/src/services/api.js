import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update with your Flask backend URL

const api = axios.create({
  baseURL: API_URL,
});

export const signupUser = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

export default api;