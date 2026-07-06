import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Hybrid Hiring Solutions';

/** Exact-path titles. */
const TITLE_BY_PATH: Record<string, string> = {
  '/': '',
  '/employers': 'Employers',
  '/jobs': 'Jobs',
  '/resources': 'Resources',
  '/about': 'About Us',
  '/contact': 'Contact Us',
  '/login': 'Log In',
  '/signup': 'Sign Up',
  '/forgot-password': 'Forgot Password',
  '/account': 'Account',
  '/admin': 'Admin',
};

/** Prefix-matched titles for dynamic/nested routes. */
const TITLE_BY_PREFIX: [prefix: string, title: string][] = [
  ['/jobs/', 'Job Details'],
  ['/reset-password/', 'Reset Password'],
  ['/onboarding/', 'Profile Builder'],
];

function resolveTitle(pathname: string): string {
  if (pathname in TITLE_BY_PATH) return TITLE_BY_PATH[pathname];
  const match = TITLE_BY_PREFIX.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : '';
}

/**
 * Keeps `document.title` in sync with the active route so each page is
 * distinctly titled (WCAG 2.4.2 Page Titled). Renders nothing.
 */
export function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = resolveTitle(pathname);
    document.title = pageTitle ? `${pageTitle} · ${SITE_NAME}` : SITE_NAME;
  }, [pathname]);

  return null;
}
