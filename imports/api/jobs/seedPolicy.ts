import { Meteor } from 'meteor/meteor';

/**
 * Sample job data is for local development only. Production should start empty
 * and only contain jobs created by admins via the panel.
 */
export function shouldSeedSampleJobs(): boolean {
  if (Meteor.isProduction) return false;
  return true;
}
