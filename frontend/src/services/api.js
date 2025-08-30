// src/services/api.js
import axios from 'axios';

// create an axios instance with base config
const api = axios.create({
  baseURL: 'http://localhost:5000', // backend base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// request interceptor to attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token stored in localStorage after login
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // attach token as Bearer
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
