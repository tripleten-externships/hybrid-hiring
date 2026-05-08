import { Meteor } from 'meteor/meteor';
import { ProfilesCollection } from '../profiles/collection';
import { NotificationsCollection } from './collection';
import type { Job } from '../jobs/collection';

/**
 * Creates a job_match notification for every user whose profile preferences
 * are compatible with the given job. Safe to call from server-only code.
 *
 * Matching rules (all OR — any match qualifies):
 *  - User has no jobTypes preference set (hasn't filtered) → always notify
 *  - User's jobTypes includes this job's jobType
 */
export async function createJobMatchNotifications(
  job: Omit<Job, '_id'>,
  jobId: string
): Promise<void> {
  if (!Meteor.isServer) return;

  const profiles = await ProfilesCollection.find({}).fetchAsync();

  for (const profile of profiles) {
    const hasTypeFilter = profile.jobTypes && profile.jobTypes.length > 0;
    const typeMatches = !hasTypeFilter || profile.jobTypes!.includes(job.jobType);

    if (!typeMatches) continue;

    await NotificationsCollection.insertAsync({
      userId: profile.userId,
      type: 'job_match',
      title: 'New job that matches your profile',
      body: `${job.title} at ${job.company} — ${job.location}`,
      jobId,
      read: false,
      createdAt: new Date(),
    });
  }
}
