import { Meteor } from 'meteor/meteor';
import { BACKGROUND_IMAGES } from 'imports/ui/constants/backgroundImages';
import { getStaticCdnBase } from 'imports/ui/constants/staticCdn';

/**
 * When a static CDN is configured, expose hero URLs as CSS variables so
 * stylesheets can use the CDN without hardcoding the domain.
 */
Meteor.startup(() => {
  if (!getStaticCdnBase()) return;

  const root = document.documentElement;
  root.style.setProperty('--bg-home-cta', `url('${BACKGROUND_IMAGES.homeCta}')`);
  root.style.setProperty('--bg-about-services', `url('${BACKGROUND_IMAGES.aboutServices}')`);
  root.style.setProperty('--bg-resources-ready', `url('${BACKGROUND_IMAGES.resourcesReady}')`);
});
