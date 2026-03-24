import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { Layout } from './layouts/Layout/Layout';
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs/Jobs';
import { NotFound } from './pages/NotFound/NotFound';
import { SignUp } from './pages/SignUp/SignUp';
import { Login } from './pages/Login/Login';
import { OnboardingPersonal, OnboardingProfessional, OnboardingSkills } from './pages/Onboarding/';
import { AuthRedirect } from './routes/AuthRedirect';
import { PrivateRoute } from './routes/PrivateRoute';
import { OnboardingPage3 } from './pages/OnboardingPage3/OnboardingPage3';
import { ContactUs } from './pages/ContactUs/ContactUs';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/onboarding/personal',
        element: <OnboardingPersonal />,
      },
      {
        path: '/onboarding/professional',
        element: <OnboardingProfessional />,
      },
      {
        path: '/onboarding/skills',
        element: <OnboardingSkills />,
      },
      {
        path: '/users/list',
        element: <PrivateRoute />,
        children: [{ path: '/users/list', element: <DemoUsersList /> }],
      },
      {
        path: '/users/manage',
        element: <PrivateRoute />,
        children: [{ path: '/users/manage', element: <DemoUsersManager /> }],
      },
      {
  path: '/contact',
  element: <ContactUs />,
},
      {
        element: <AuthRedirect />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/signup', element: <SignUp /> },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        element: <PrivateRoute />,
        children: [{ path: '/jobs', element: <Jobs /> }],
      },
      {
        element: <PrivateRoute />,
        children: [{ path: '/onboarding/3', element: <OnboardingPage3 /> }],
      },
      
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
