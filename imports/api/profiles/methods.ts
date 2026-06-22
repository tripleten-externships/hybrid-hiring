import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { UserProfile, ProfilesCollection } from './collection';

const requireUser = (userId: string | null): string => {
  if (!userId) {
    throw new Meteor.Error('not-authorized', 'Login required');
  }
  return userId;
};

export async function create(data: UserProfile) {
  requireUser(Meteor.userId());
  return ProfilesCollection.insertAsync({ ...data });
}

export async function update(_id: string, data: Mongo.Modifier<UserProfile>) {
  const userId = requireUser(Meteor.userId());
  check(_id, String);
  const profile = await ProfilesCollection.findOneAsync(_id);
  if (!profile || profile.userId !== userId) {
    throw new Meteor.Error('not-authorized', 'Not your profile');
  }
  return ProfilesCollection.updateAsync(_id, { ...data });
}

export async function remove(_id: string) {
  const userId = requireUser(Meteor.userId());
  check(_id, String);
  const profile = await ProfilesCollection.findOneAsync(_id);
  if (!profile || profile.userId !== userId) {
    throw new Meteor.Error('not-authorized', 'Not your profile');
  }
  return ProfilesCollection.removeAsync(_id);
}

export async function findById(_id: string) {
  requireUser(Meteor.userId());
  check(_id, String);
  return ProfilesCollection.findOneAsync(_id);
}

const upsert = async (data: UserProfile) => {
  const userId = requireUser(Meteor.userId());

  const { userId: _ignoredUserId, createdAt: _ignoredCreatedAt, ...safeData } = data;

  const profile = await ProfilesCollection.findOneAsync({ userId });

  if (profile && profile._id) {
    await ProfilesCollection.updateAsync(profile._id, {
      $set: { ...safeData, updatedAt: new Date() },
    });
  } else {
    await ProfilesCollection.insertAsync({
      ...safeData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
};

// Avatars are resized client-side before upload; this caps the stored data URL
// to a safe size (roughly ~1MB of base64) as a server-side guardrail.
const MAX_AVATAR_CHARS = 1_400_000;
const AVATAR_DATA_URL_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i;

const setAvatar = async (dataUrl: string) => {
  const userId = requireUser(Meteor.userId());
  check(dataUrl, String);

  if (!AVATAR_DATA_URL_RE.test(dataUrl)) {
    throw new Meteor.Error('invalid-image', 'Please upload a valid image file.');
  }
  if (dataUrl.length > MAX_AVATAR_CHARS) {
    throw new Meteor.Error('image-too-large', 'Image is too large. Please choose a smaller photo.');
  }

  const profile = await ProfilesCollection.findOneAsync({ userId });
  if (profile && profile._id) {
    await ProfilesCollection.updateAsync(profile._id, {
      $set: { avatar: dataUrl, updatedAt: new Date() },
    });
  } else {
    await ProfilesCollection.insertAsync({
      userId,
      avatar: dataUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
};

const removeAvatar = async () => {
  const userId = requireUser(Meteor.userId());
  await ProfilesCollection.updateAsync(
    { userId },
    { $unset: { avatar: '' }, $set: { updatedAt: new Date() } }
  );
};

const toggleSaveJob = async (jobId: string) => {
  const userId = requireUser(Meteor.userId());

  check(jobId, String);

  const profile = await ProfilesCollection.findOneAsync({ userId });
  const savedJobIds = profile?.savedJobs || [];

  if (savedJobIds.includes(jobId)) {
    await ProfilesCollection.updateAsync(
      { userId },
      {
        $pull: { savedJobs: jobId },
        $set: { updatedAt: new Date() },
      }
    );

    return false; // job removed
  } else {
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
  'UserProfiles.create': create,
  'UserProfiles.update': update,
  'UserProfiles.remove': remove,
  'UserProfiles.findById': findById,
  'UserProfiles.upsert': upsert,
  'UserProfiles.toggleSaveJob': toggleSaveJob,
  'UserProfiles.setAvatar': setAvatar,
  'UserProfiles.removeAvatar': removeAvatar,
});
