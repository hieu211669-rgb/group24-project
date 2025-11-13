// src/App.js
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import SignUp from './components/Signup';
import Profile from './components/Profile';
import UserList from './components/UserList';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import api from "./api"
import AdminLogs from './components/AdminLogs';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 🔹 Hàm đăng xuất dùng chung cho cả admin và user
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      await api.post('/auth/logout', { refreshToken });

      // Xóa token ở client
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Redirect về login
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Logout failed');
    }
  };


  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* 🔹 Truyền token & onLogout vào các trang có xác thực */}
        <Route path="/profile" element={<Profile token={token} onLogout={handleLogout} />} />
        <Route path="/admin" element={<UserList token={token} onLogout={handleLogout} />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/log" element={<AdminLogs />} />
      </Routes>
    </Router>
  );
}

export default App;
