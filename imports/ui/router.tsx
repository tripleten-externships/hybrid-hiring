import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { Layout } from './layouts/Layout/Layout';
import { Home } from './pages/Home';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { Login } from './pages/Login/Login';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/users/list',
        element: <DemoUsersList />,
      },
      {
        path: '/users/manage',
        element: <DemoUsersManager />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
