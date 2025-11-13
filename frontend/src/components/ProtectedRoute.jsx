import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token || token === "undefined" || token === "") {
    return <Navigate to="/" replace />; // redirect về login
  }

  return children;
}
