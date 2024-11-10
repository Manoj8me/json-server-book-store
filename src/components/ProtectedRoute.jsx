import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('username');  // Check if the user is logged in

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/" replace />;
  }

  return children;  // If authenticated, allow access to the route
};

export default ProtectedRoute;
