import { Meteor } from 'meteor/meteor';
import { ApplicationsCollection } from './collection';
import { isAdminAsync } from '../admin/collection';

/** Publishes the logged-in user's applications (jobId only) so the UI can mark
 *  jobs they've already applied to. */
Meteor.publish('applications.mine', function () {
  if (!this.userId) return this.ready();

  return ApplicationsCollection.find({ userId: this.userId }, { fields: { jobId: 1, userId: 1 } });
});

/** Admin-only: publishes every application's jobId (no applicant PII) so the
 *  admin panel can show how many people applied to each position. */
Meteor.publish('applications.adminCounts', async function () {
  if (!this.userId || !(await isAdminAsync(this.userId))) {
    return this.ready();
  }

  return ApplicationsCollection.find({}, { fields: { jobId: 1 } });
});
