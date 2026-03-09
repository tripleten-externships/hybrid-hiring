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

  async 'Profiles.toggleSaveJob'(jobId: string) {
    const userId = requireUser(this.userId);

    check(jobId, String);

    const profile = await ProfilesCollection.findOneAsync({ userId });
    const savedJobIds = profile?.savedJobIds || [];

    if (savedJobIds.includes(jobId)) {
      // remove job
      await ProfilesCollection.updateAsync(
        { userId },
        {
          $pull: { savedJobIds: jobId },
          $set: { updatedAt: new Date() },
        }
      );

      return false; // job removed
    } else {
      // add job
      if (profile) {
        await ProfilesCollection.updateAsync(
          { userId },
          {
            $addToSet: { savedJobIds: jobId },
            $set: { updatedAt: new Date() },
          }
        );
      } else {
        await ProfilesCollection.insertAsync({
          userId,
          savedJobIds: [jobId],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return true; // job added
    }
  },
});
