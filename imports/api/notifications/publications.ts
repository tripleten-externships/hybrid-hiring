import { Meteor } from 'meteor/meteor';
import { NotificationsCollection } from './collection';

/** Publishes the 30 most recent notifications for the logged-in user. */
Meteor.publish('notifications.mine', function () {
  if (!this.userId) return this.ready();

  return NotificationsCollection.find(
    { userId: this.userId },
    { sort: { createdAt: -1 }, limit: 30 }
  );
});
