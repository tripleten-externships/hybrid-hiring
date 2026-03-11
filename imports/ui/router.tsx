import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './layouts/Layout/Layout';
import { Home } from './pages/Home';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { PrivateRoute } from './routes/PrivateRoute';
import { AdminRoute } from './routes/AdminRoute';
import { Stub } from './pages/StubPage/stub';

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
        element: <Stub />,
      },
      // path to job details
      // need to add element path to jobs details
      {
        path: '/jobs/:jobId',
        element: <Stub />,
      },
      // path to About
      // need to add element path to About
      {
        path: '/about',
        element: <Stub />,
      },
      // path to contact
      // need to add element path to contact
      {
        path: '/contact',
        element: <Stub />,
      },
      // private path to onboarding1
      // need to add element to onboarding1
      {
        path: '/onboarding/1',
        element: (
          <PrivateRoute>
            <Stub />
          </PrivateRoute>
        ),
      },
      // private path to onboarding2
      // need to add element to onboarding2
      {
        path: '/onboarding/2',
        element: (
          <PrivateRoute>
            <Stub />
          </PrivateRoute>
        ),
      },
      // private path to onboarding3
      // need to add element to onboarding3
      {
        path: '/onboarding/3',
        element: (
          <PrivateRoute>
            <Stub />
          </PrivateRoute>
        ),
      },
      // admin path to admin jobs
      // need to add element to adminJobs
      {
        path: 'admin/jobs',
        element: (
          <AdminRoute>
            <Stub />
          </AdminRoute>
        ),
      },
      // admin path to admin contacts
      // need to add element to adminContacts
      {
        path: 'admin/contacts',
        element: (
          <AdminRoute>
            <Stub />
          </AdminRoute>
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
