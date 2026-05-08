import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { NotificationsCollection } from './collection';

Meteor.methods({
  async 'notifications.markRead'(notificationId: string) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    check(notificationId, String);

    await NotificationsCollection.updateAsync(
      { _id: notificationId, userId: this.userId },
      { $set: { read: true } }
    );
  },

  async 'notifications.markAllRead'() {
    if (!this.userId) throw new Meteor.Error('not-authorized');

    await NotificationsCollection.updateAsync(
      { userId: this.userId, read: false },
      { $set: { read: true } },
      { multi: true }
    );
  },
});
