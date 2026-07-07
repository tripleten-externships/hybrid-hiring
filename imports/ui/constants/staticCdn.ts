import { Meteor } from 'meteor/meteor';

type PublicSettings = {
  staticCdnUrl?: string;
};

/** CDN base URL from METEOR_SETTINGS.public.staticCdnUrl (no trailing slash). */
export function getStaticCdnBase(): string {
  const settings = Meteor.settings as { public?: PublicSettings } | undefined;
  const base = settings?.public?.staticCdnUrl?.trim().replace(/\/$/, '');
  return base ?? '';
}

/** Resolve a site-relative asset path against the optional static CDN. */
export function staticAssetUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const cdn = getStaticCdnBase();
  return cdn ? `${cdn}${normalized}` : normalized;
}
