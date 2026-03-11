import React, { ReactNode } from 'react';
import { Meteor } from 'meteor/meteor';
import { Navigate, Outlet, useLocation } from 'react-router-dom';


interface PrivateRouteProps {
  children?: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const loggedIn = Meteor.user();

  if (!loggedIn) {
    // if not logged in, redirect to login page
    return <Navigate state={{ from: location }} to="/login" replace />;
  } else {
    // if logged in, show current page
    return children ? <>{children}</> : <Outlet />;
  }
};

export default PrivateRoute;
