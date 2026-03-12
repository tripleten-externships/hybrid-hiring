import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { UserProfile, ProfilesCollection } from './collection';

const requireUser = (userId: string | null): string => {
  if (!userId) {
    throw new Meteor.Error('not-authorized', 'Login required');
  }
  return userId;
};

export async function create(data: UserProfile) {
  return ProfilesCollection.insertAsync({ ...data });
}

export async function update(_id: string, data: Mongo.Modifier<UserProfile>) {
  check(_id, String);
  return ProfilesCollection.updateAsync(_id, { ...data });
}

export async function remove(_id: string) {
  check(_id, String);
  return ProfilesCollection.removeAsync(_id);
}

export async function findById(_id: string) {
  check(_id, String);
  return ProfilesCollection.findOneAsync(_id);
}

const upsert = async (data: UserProfile) => {
  const userId = requireUser(Meteor.userId());

  check(data, Match.ObjectIncluding({}));
  const profile = await ProfilesCollection.findOneAsync({ userId });

  if (profile && profile._id) {
    await ProfilesCollection.updateAsync(profile._id, {
      $set: { ...data, updatedAt: new Date() },
    });
  } else {
    await ProfilesCollection.insertAsync({
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
};

const toggleSaveJob = async (jobId: string) => {
  const userId = requireUser(Meteor.userId());

  check(jobId, String);

  const profile = await ProfilesCollection.findOneAsync({ userId });
  const savedJobIds = profile?.savedJobs || [];

  if (savedJobIds.includes(jobId)) {
    // remove job
    await ProfilesCollection.updateAsync(
      { userId },
      {
        $pull: { savedJobs: jobId },
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
          $addToSet: { savedJobs: jobId },
          $set: { updatedAt: new Date() },
        }
      );
    } else {
      await ProfilesCollection.insertAsync({
        userId,
        savedJobs: [jobId],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return true; // job added
  }
};

Meteor.methods({
  'Profile.create': create,
  'Profile.update': update,
  'Profile.remove': remove,
  'Profile.find': findById,
  'UserProfiles.upsert': upsert,
  'UserProfiles.toggleSaveJob': toggleSaveJob,
});
