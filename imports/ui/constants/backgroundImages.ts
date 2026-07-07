import { staticAssetUrl } from './staticCdn';

/** Optimized WebP assets (see public/assets/images/*.webp). */
export const BACKGROUND_IMAGES = {
  homeHeader: staticAssetUrl('/assets/images/hh_home_header.webp'),
  homeCta: staticAssetUrl('/assets/images/hh_new_beginning.webp'),
  aboutHeader: staticAssetUrl('/assets/images/hh_about_header.webp'),
  aboutServices: staticAssetUrl('/assets/images/hh_about_services.webp'),
  aboutIndustry: staticAssetUrl('/assets/images/hh_about_industry.webp'),
  employersHeader: staticAssetUrl('/assets/images/hh_employers_header.webp'),
  resourcesHeader: staticAssetUrl('/assets/images/hh_resources_header.webp'),
  resourcesReady: staticAssetUrl('/assets/images/hh_resources_ready.webp'),
  contactWorker: staticAssetUrl('/assets/images/hh_contact_worker.webp'),
} as const;

/** Background images to warm-cache when each route is active. */
export const ROUTE_BACKGROUND_IMAGES: Record<string, readonly string[]> = {
  '/': [BACKGROUND_IMAGES.homeHeader, BACKGROUND_IMAGES.homeCta],
  '/about': [BACKGROUND_IMAGES.aboutHeader, BACKGROUND_IMAGES.aboutServices],
  '/employers': [BACKGROUND_IMAGES.employersHeader, BACKGROUND_IMAGES.homeCta],
  '/resources': [BACKGROUND_IMAGES.resourcesHeader, BACKGROUND_IMAGES.resourcesReady],
  '/contact': [BACKGROUND_IMAGES.contactWorker],
};
