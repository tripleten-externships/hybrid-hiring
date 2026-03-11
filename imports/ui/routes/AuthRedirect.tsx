import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthRedirect: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/jobs" replace />;
  return children;
};
