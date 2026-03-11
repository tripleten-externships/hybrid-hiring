import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './layouts/Layout/Layout';
import { Home } from './pages/Home';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { Login } from './pages/Login/Login';
import { Jobs } from './pages/Jobs/Jobs';

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
      {
        path: '/jobs',
        element: <Jobs />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
