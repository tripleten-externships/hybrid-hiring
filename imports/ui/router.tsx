import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';

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
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
