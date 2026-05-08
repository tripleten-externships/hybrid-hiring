import { Meteor } from 'meteor/meteor';
import { AdminCollection, isAdminAsync } from './collection';

Meteor.publish('myAdminRecord', function publishMyAdminRecord() {
  if (!this.userId) return this.ready();
  return AdminCollection.find({ userId: this.userId });
});

Meteor.publish('allAdminRecords', async function publishAllAdminRecords() {
  if (!this.userId) return this.ready();
  if (!(await isAdminAsync(this.userId))) return this.ready();
  return AdminCollection.find({});
});
