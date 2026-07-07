import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteBackgroundImages } from '../../constants/backgroundImages';
import { preloadImages } from '../../utils/preloadImage';

/** Preloads page background images when the route changes. */
export function RouteBackgroundPreloader() {
  const { pathname } = useLocation();

  useEffect(() => {
    preloadImages(getRouteBackgroundImages(pathname));
  }, [pathname]);

  return null;
}
