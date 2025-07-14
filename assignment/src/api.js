import axios from 'axios';

// ✅ Create a reusable Axios instance with base URL
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
