import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { Layout } from './layouts/Layout/Layout';
import { Home } from './pages/Home';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { SignUp } from './pages/SignUp/SignUp';
import { OnboardingPage2 } from './pages/OnboardingPage2/OnboardingPage2';

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
        path: '/onboarding/2',
        element: <OnboardingPage2 />,
      },
      {
        path: '/users/manage',
        element: <DemoUsersManager />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
