import { staticAssetUrl } from './staticCdn';

const BACKGROUND_IMAGE_PATHS = {
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

export type BackgroundImageKey = keyof typeof BACKGROUND_IMAGE_PATHS;

/**
 * Resolved at read time so Meteor.settings.public.staticCdnUrl is available
 * (module-level constants would bake in local paths before settings load).
 */
export const BACKGROUND_IMAGES: Record<BackgroundImageKey, string> = new Proxy(
  {} as Record<BackgroundImageKey, string>,
  {
    get(_target, key: string) {
      if (key in BACKGROUND_IMAGE_PATHS) {
        return staticAssetUrl(BACKGROUND_IMAGE_PATHS[key as BackgroundImageKey]);
      }
      return undefined;
    },
  }
);

const ROUTE_BACKGROUND_KEYS: Record<string, readonly BackgroundImageKey[]> = {
  '/': ['homeHeader', 'homeCta'],
  '/about': ['aboutHeader', 'aboutServices'],
  '/employers': ['employersHeader', 'homeCta'],
  '/resources': ['resourcesHeader', 'resourcesReady'],
  '/contact': ['contactWorker'],
};

export function getRouteBackgroundImages(pathname: string): readonly string[] {
  const keys = ROUTE_BACKGROUND_KEYS[pathname] ?? [];
  return keys.map((key) => BACKGROUND_IMAGES[key]);
}
