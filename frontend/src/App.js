import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import SignUp from './components/Signup';
import Profile from './components/Profile';
import UserList from './components/UserList';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/';
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login setToken={setToken} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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
