import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Profile, ProfileCollection } from './collection';

export async function create(data: Profile) {
  return ProfileCollection.insertAsync({ ...data });
}

export async function update(_id: string, data: Mongo.Modifier<Profile>) {
  check(_id, String);
  return ProfileCollection.updateAsync(_id, { ...data });
}

export async function remove(_id: string) {
  check(_id, String);
  return ProfileCollection.removeAsync(_id);
}

export async function findById(_id: string) {
  check(_id, String);
  return ProfileCollection.findOneAsync(_id);
}

Meteor.methods({
  'Profile.create': create,
  'Profile.update': update,
  'Profile.remove': remove,
  'Profile.find': findById,
});
