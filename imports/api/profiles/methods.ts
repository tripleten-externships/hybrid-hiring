import { Meteor } from 'meteor/meteor';
import { ProfilesCollection } from './collection';
import { check, Match } from 'meteor/check';

const requireUser = (userId: string | null): string => {
  if (!userId) {
    throw new Meteor.Error('not-authorized', 'Login required');
  }
  return userId;
};

Meteor.methods({
  async 'Profiles.upsert'(data) {
    const userId = requireUser(this.userId);

    check(data, Match.ObjectIncluding({}));
    const profile = await ProfilesCollection.findOneAsync({ userId });

    if (profile) {
      await ProfilesCollection.updateAsync(profile._id, {
        $set: { ...data, updatedAt: new Date() },
      });
    } else {
      await ProfilesCollection.insertAsync({
        userId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  },
});
