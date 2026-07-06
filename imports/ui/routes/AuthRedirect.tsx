import { useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useIsLoggedIn } from '../hooks/useCurrentUser';
import { PageSpinner } from '../components/Spinner/Spinner';

export const AuthRedirect = () => {
  const isLoggingIn = useTracker(() => Meteor.loggingIn(), []);
  const isLoggedIn = useIsLoggedIn();

  // Only block on the *initial* session resume (before we know whether the
  // visitor is already authenticated). Once auth has settled once, never swap
  // the form out for a spinner again: an explicit login attempt also flips
  // Meteor.loggingIn() to true, and unmounting <Login/> here would wipe its
  // fields and error message before a failed-login error could ever render.
  const settledRef = useRef(false);
  if (!isLoggingIn) settledRef.current = true;

  if (isLoggingIn && !settledRef.current) return <PageSpinner />;
  if (isLoggedIn) return <Navigate to="/jobs" replace />;
  return <Outlet />;
};
