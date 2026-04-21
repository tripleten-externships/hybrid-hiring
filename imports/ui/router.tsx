import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { Layout } from './layouts/Layout/Layout';
import { ContactUs } from './pages/ContactUs/ContactUs';
import { Home } from './pages/Home';
import JobBoard from './pages/JobBoard';
import { Login } from './pages/Login/Login';
import { NotFound } from './pages/NotFound/NotFound';
import { OnboardingPersonal, OnboardingProfessional, OnboardingSkills } from './pages/Onboarding';
import { SignUp } from './pages/SignUp/SignUp';
import { AuthRedirect } from './routes/AuthRedirect';
import { PrivateRoute } from './routes/PrivateRoute';

const privateRoute = (element: React.ReactElement) => ({
  element: <PrivateRoute />,
  children: [{ index: true, element }],
});

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      {
        element: <AuthRedirect />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/signup', element: <SignUp /> },
        ],
      },
      { path: '/contact', element: <ContactUs /> },
      { path: '/jobs', element: <JobBoard /> },
      {
        path: '/onboarding/personal',
        ...privateRoute(<OnboardingPersonal />),
      },
      {
        path: '/onboarding/professional',
        ...privateRoute(<OnboardingProfessional />),
      },
      {
        path: '/onboarding/skills',
        ...privateRoute(<OnboardingSkills />),
      },
      {
        path: '/users/list',
        ...privateRoute(<DemoUsersList />),
      },
      {
        path: '/users/manage',
        ...privateRoute(<DemoUsersManager />),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
