import API from './config.js';

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (email, password, role) => {
  return API.post('/auth/login', { email, password, role });
};

export const registerUser = (name, email, password, role) => {
  return API.post('/auth/register', { name, email, password, role });
};

export const getCurrentUser = (token) => {
  return API.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateProfile = (userData) => {
  return API.put('/auth/update-profile', userData);
};

export const updateUserRole = (role) => {
  return API.put('/auth/update-role', { role });
};

export const getSkills = () => API.get('/auth/skills');

export const saveSkills = (skills) => API.put('/auth/skills', { skills }); 