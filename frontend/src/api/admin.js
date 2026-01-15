import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const addQuestion = (questionData) => {
  return axios.post(`${API_URL}/admin/questions`, questionData, getAuthHeader());
};

export const updateQuestion = (id, questionData) => {
  return axios.put(`${API_URL}/admin/quiz/${id}`, questionData, getAuthHeader());
};

export const deleteQuestion = (id) => {
  return axios.delete(`${API_URL}/admin/quiz/${id}`, getAuthHeader());
};