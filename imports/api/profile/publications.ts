import { Meteor } from 'meteor/meteor';
import { ProfileCollection } from './collection';

Meteor.publish('myProfile', function publishMyProfile() {
  if (!this.userId) return this.ready();
  return ProfileCollection.find({ userId: this.userId });
});
