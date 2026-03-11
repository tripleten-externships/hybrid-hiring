import React, { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// import useLocation, call to get current location
// add a state prop to the Navigate line that passes the current location

interface PrivateRouteProps {
  children?: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate state={{ from: location }} to='/login' replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
