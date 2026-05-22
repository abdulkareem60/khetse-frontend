import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach admin ID header automatically for admin API calls
API.interceptors.request.use(config => {
  const userData = localStorage.getItem('khetse_user');
  if (userData) {
    const user = JSON.parse(userData);
    if (user?.role === 'admin' && user?.userId) {
      config.headers['X-Admin-Id'] = String(user.userId);
    }
  }
  return config;
});

export default API;