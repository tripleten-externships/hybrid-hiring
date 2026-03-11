import PrivateRoute from '../../components/PrivateRoute';

export const Jobs = () => {
  return (
    <PrivateRoute>
      <h2>Hi, I'm the Jobs page!</h2>
      <p>You can only see me if you're logged in! 😏</p>
      <p>There will be jobs here someday...</p>
    </PrivateRoute>
  );
};
