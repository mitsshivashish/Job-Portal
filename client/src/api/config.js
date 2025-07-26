import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({ 
  baseURL: `${API_BASE_URL}/api`, 
  withCredentials: true 
});

export default API; 