import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './layouts/Layout/Layout';
import { Home } from './pages/Home';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { PrivateRoute } from './routes/PrivateRoute';

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
      // path to jobs
      // need to add element path to jobs
      {
        path: '/jobs',
        element: <></>,
      },
      // path to job details
      // need to add element path to jobs details
      {
        path: '/jobs/:jobId',
        element: <></>,
      },
      // path to About
      // need to add element path to About
      {
        path: '/about',
        element: <></>,
      },
      // path to contact
      // need to add element path to contact
      {
        path: '/contact',
        element: <></>,
      },
      // private path to onboarding1
      // need to add element to onboarding1
      {
        path: '/onboarding/1',
        element: (
          <PrivateRoute>
            <></>
          </PrivateRoute>
        ),
      },
      // private path to onboarding2
      // need to add element to onboarding2
      {
        path: '/onboarding/2',
        element: (
          <PrivateRoute>
            <></>
          </PrivateRoute>
        ),
      },
      // private path to onboarding3
      // need to add element to onboarding3
      {
        path: '/onboarding/3',
        element: (
          <PrivateRoute>
            <></>
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
