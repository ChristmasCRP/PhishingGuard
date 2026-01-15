import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const loginUser = (credentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  return axios.post(`${API_URL}/login`, formData);
};

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};