import { Meteor } from 'meteor/meteor';
import { ProfilesCollection } from './collection';

Meteor.publish('userProfiles.mine', function () {
  if (!this.userId) {
    this.ready();
    return;
  }

  return ProfilesCollection.find({ userId: this.userId });
});
