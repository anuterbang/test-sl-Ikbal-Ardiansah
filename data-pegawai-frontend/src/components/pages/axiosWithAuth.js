import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosWithAuth.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // DEBUG
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Token tidak ditemukan!');
  }
  return config;
});


export default axiosWithAuth;

