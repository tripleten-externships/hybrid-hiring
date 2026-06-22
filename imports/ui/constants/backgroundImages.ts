/** Optimized WebP assets (see public/assets/images/*.webp). */
export const BACKGROUND_IMAGES = {
  homeHeader: '/assets/images/hh_home_header.webp',
  homeCta: '/assets/images/hh_new_beginning.webp',
  aboutHeader: '/assets/images/hh_about_header.webp',
  aboutServices: '/assets/images/hh_about_services.webp',
  aboutIndustry: '/assets/images/hh_about_industry.webp',
  employersHeader: '/assets/images/hh_employers_header.webp',
  resourcesHeader: '/assets/images/hh_resources_header.webp',
  resourcesReady: '/assets/images/hh_resources_ready.webp',
  contactWorker: '/assets/images/hh_contact_worker.webp',
} as const;

/** Background images to warm-cache when each route is active. */
export const ROUTE_BACKGROUND_IMAGES: Record<string, readonly string[]> = {
  '/': [BACKGROUND_IMAGES.homeHeader, BACKGROUND_IMAGES.homeCta],
  '/about': [BACKGROUND_IMAGES.aboutHeader, BACKGROUND_IMAGES.aboutServices],
  '/employers': [BACKGROUND_IMAGES.employersHeader, BACKGROUND_IMAGES.homeCta],
  '/resources': [BACKGROUND_IMAGES.resourcesHeader, BACKGROUND_IMAGES.resourcesReady],
  '/contact': [BACKGROUND_IMAGES.contactWorker],
};
