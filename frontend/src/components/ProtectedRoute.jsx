import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ token, children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem('user')); // nếu bạn lưu user info

  if (!token) return <Navigate to="/login" />; // không có token → redirect

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" />; // role không đúng
  }

  return children;
}
