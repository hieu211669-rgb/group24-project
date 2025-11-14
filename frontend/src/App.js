import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import SignUp from './components/Signup';
import Profile from './components/Profile';
import UserList from './components/UserList';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import api from "./api"
import AdminLogs from './components/AdminLogs';
import ProtectedRoute from './components/ProtectedRoute';

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
    <Routes>
      <Route path="/" element={<Login setToken={setToken} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login  />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/logs" element={<AdminLogs  />} />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute token={token}>
            <Profile token={token} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute token={token}>
            <UserList token={token} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
