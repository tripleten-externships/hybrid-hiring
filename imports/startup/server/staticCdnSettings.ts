import { Meteor } from 'meteor/meteor';

/**
 * Galaxy users often set env vars in galaxy.meteor.com.env. Merge STATIC_CDN_URL
 * into Meteor.settings.public on the server so it is embedded in the client's
 * __meteor_runtime_config__.PUBLIC_SETTINGS.
 *
 * Runs at module load (not Meteor.startup) so the value is present before the
 * first HTML response is generated.
 */
if (Meteor.isServer) {
  const fromEnv = process.env.STATIC_CDN_URL?.trim().replace(/\/$/, '');
  if (fromEnv) {
    const settings = Meteor.settings as { public?: Record<string, string> };
    settings.public = settings.public ?? {};
    if (!settings.public.staticCdnUrl) {
      settings.public.staticCdnUrl = fromEnv;
    }
  }
}
