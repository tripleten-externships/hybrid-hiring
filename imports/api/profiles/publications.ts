import { Meteor } from 'meteor/meteor';
import { ProfilesCollection } from './collection';

Meteor.publish('profiles.mine', function () {
  if (!this.userId) {
    this.ready();
    return;
  }

  return ProfilesCollection.find({ userId: this.userId });
});
