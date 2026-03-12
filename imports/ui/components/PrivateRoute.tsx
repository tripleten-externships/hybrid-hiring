import React, { ReactNode } from 'react';
import { Meteor } from 'meteor/meteor';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children?: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const loggedIn = Meteor.user();
  const from = location.state?.from;

  if (!loggedIn) {
    // if not logged in, redirect to login page, after the user logs in they'll be redirected to jobs
    return <Navigate state={{ from: location }} to="/login" replace />;
  } else {
    if (!from) {
      // if from is undefined, redirect to /jobs
      return <Navigate to="/jobs" replace />;
    } else {
      // if from is defined, show current page
      return children ? <>{children}</> : <Outlet />;
    }
  }
};

export default PrivateRoute;
