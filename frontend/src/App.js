// src/App.js
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import SignUp from './components/Signup';
import Profile from './components/Profile';
import UserList from './components/UserList';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminLogs from './components/AdminLogs';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 🔹 Hàm đăng xuất dùng chung cho cả admin và user
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/'; // quay lại trang Login
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
