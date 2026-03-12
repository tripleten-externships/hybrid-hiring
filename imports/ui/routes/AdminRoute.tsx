import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useIsAdmin } from '../hooks/useCurrentUser';
import { Spinner } from '../components/Spinner/Spinner';

export const AdminRoute = () => {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) return <Spinner />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};
