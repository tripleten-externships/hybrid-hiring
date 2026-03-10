import { Meteor } from 'meteor/meteor';
import { AdminCollection } from './collection';

Meteor.publish('myAdminRecord', function publishMyAdminRecord() {
  if (!this.userId) return this.ready();
  return AdminCollection.find({ userId: this.userId });
});
