import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DemoUsersList } from './examples/DemoUsersList';
import { DemoUsersManager } from './examples/DemoUsersManager';
import { Layout } from './layouts/Layout/Layout';
import { AboutUs } from './pages/AboutUs/AboutUs';
import { Account } from './pages/Account/Account';
import { Admin } from './pages/Admin/Admin';
import { ContactUs } from './pages/ContactUs/ContactUs';
import { Employers } from './pages/Employers/Employers';
import { Home } from './pages/Home';
import { JobBoard } from './pages/JobBoard/JobBoard';
import { JobDetail } from './pages/JobDetail/JobDetail';
import { Login } from './pages/Login/Login';
import { NotFound } from './pages/NotFound/NotFound';
import { OnboardingPersonal, OnboardingProfessional, OnboardingSkills } from './pages/Onboarding';
import { Resources } from './pages/Resources/Resources';
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
        children: [{ path: '/login', element: <Login /> }],
      },
      { path: '/signup', element: <SignUp /> },
      { path: '/about', element: <AboutUs /> },
      { path: '/contact', element: <ContactUs /> },
      { path: '/employers', element: <Employers /> },
      { path: '/resources', element: <Resources /> },
      { path: '/jobs', element: <JobBoard /> },
      { path: '/jobs/:jobId', element: <JobDetail /> },
      {
        path: '/account',
        ...privateRoute(<Account />),
      },
      {
        path: '/admin',
        ...privateRoute(<Admin />),
      },
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
