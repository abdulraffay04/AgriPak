// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
  // read token and user from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // if no token -> go to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // if role prop is provided, check user's role
  if (role && user?.role !== role) {
    // unauthorized -> redirect to appropriate dashboard or login
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'user') return <Navigate to="/user/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // allowed
  return children;
}

export default ProtectedRoute;
