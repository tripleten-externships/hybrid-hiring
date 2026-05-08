import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useIsLoggedIn } from '../hooks/useCurrentUser';
import { PageSpinner } from '../components/Spinner/Spinner';

export const PrivateRoute = () => {
  const location = useLocation();
  const isLoading = useTracker(() => Meteor.loggingIn(), []);
  const isLoggedIn = useIsLoggedIn();

  if (isLoading) return <PageSpinner />;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};
