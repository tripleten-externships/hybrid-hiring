import { Meteor } from 'meteor/meteor';
import { ApplicationsCollection } from './collection';

/** Publishes the logged-in user's applications (jobId only) so the UI can mark
 *  jobs they've already applied to. */
Meteor.publish('applications.mine', function () {
  if (!this.userId) return this.ready();

  return ApplicationsCollection.find(
    { userId: this.userId },
    { fields: { jobId: 1, userId: 1 } }
  );
});
