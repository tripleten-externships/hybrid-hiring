import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useIsLoggedIn } from '../hooks/useCurrentUser';
import { Spinner } from '../components/Spinner/Spinner';

export const AuthRedirect = () => {
  const isLoading = useTracker(() => Meteor.loggingIn(), []);
  const isLoggedIn = useIsLoggedIn();

  if (isLoading) return <Spinner />;
  if (isLoggedIn) return <Navigate to="/jobs" replace />;
  return <Outlet />;
};
