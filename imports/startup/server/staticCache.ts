import { WebApp } from 'meteor/webapp';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Serve static background images with a long-lived, immutable cache policy.
 *
 * Files in `public/` are served by Meteor without a content hash in the URL, so
 * by default they get `Cache-Control: public, max-age=0` and the browser
 * revalidates on every visit (a 304 round trip that makes backgrounds feel slow
 * even when already cached). These filenames are stable, so we let the browser
 * trust its cache for a year.
 *
 * This runs on `rawConnectHandlers`, which executes before Meteor's static-file
 * middleware. Meteor serves public assets via the `send` library, which only
 * sets `Cache-Control` when one isn't already present — so setting it here wins.
 *
 * When an image is replaced, rename it (or bump a `?v=` query) and update its
 * path so the URL changes and busts the cache.
 */
WebApp.rawConnectHandlers.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
  if (req.url && req.url.startsWith('/assets/images/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});
