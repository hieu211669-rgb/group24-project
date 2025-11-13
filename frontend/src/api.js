// src/api/axios.js
import axios from 'axios';

// Tạo axios instance mặc định
const API = axios.create({
  baseURL: 'http://localhost:3000/api', // đổi theo server backend
});

// Tự động gắn token cho mọi request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// 🧩 API riêng: Lấy logs (chỉ admin mới xem được)
export const getLogs = async () => {
  try {
    const res = await API.get('/logs'); // ✅ dùng instance API
    return res.data;
  } catch (err) {
    console.error('Fetch logs error:', err.response?.data || err.message);
    throw err;
  }
};

export default API;
