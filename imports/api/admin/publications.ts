import { Meteor } from 'meteor/meteor';
import { AdminCollection } from './collection';

Meteor.publish('myAdminRecord', function publishMyAdminRecord() {
  if (!this.userId) return this.ready();
  return AdminCollection.find({ userId: this.userId });
});

Meteor.publish('allAdminRecords', function publishAllAdminRecords() {
  if (!this.userId) return this.ready();
  const isAdmin = AdminCollection.findOne({ userId: this.userId });
  if (!isAdmin) return this.ready();
  return AdminCollection.find({});
});
