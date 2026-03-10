import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
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
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
