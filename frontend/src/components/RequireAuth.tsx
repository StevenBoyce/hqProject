import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    // Redirect to login, preserving the current location for potential redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 