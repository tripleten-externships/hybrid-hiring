import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // POP = browser back/forward — let the browser restore the scroll position
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, navigationType]);

  return null;
};
