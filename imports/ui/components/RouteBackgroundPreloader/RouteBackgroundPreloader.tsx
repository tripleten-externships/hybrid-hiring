import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_BACKGROUND_IMAGES } from '../../constants/backgroundImages';
import { preloadImages } from '../../utils/preloadImage';

/** Preloads page background images when the route changes. */
export function RouteBackgroundPreloader() {
  const { pathname } = useLocation();

  useEffect(() => {
    preloadImages(ROUTE_BACKGROUND_IMAGES[pathname] ?? []);
  }, [pathname]);

  return null;
}
