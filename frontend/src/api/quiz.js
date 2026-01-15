import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getQuestions = (quizId) => {
  return axios.get(`${API_URL}/quiz/${quizId}`);
};

export const checkAnswer = (questionId, selectedIndex) => {
  return axios.post(`${API_URL}/quiz/check`, {
    question_id: questionId,
    selected_index: selectedIndex
  }, getAuthHeader());
};

export const getQuizList = () => {
  return axios.get(`${API_URL}/quiz/list`); 
};