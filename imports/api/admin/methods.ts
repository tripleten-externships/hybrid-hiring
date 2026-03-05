import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Admin, AdminCollection } from './collection';

export async function create(data: Admin) {
  return AdminCollection.insertAsync({ ...data });
}

export async function update(_id: string, data: Mongo.Modifier<Admin>) {
  check(_id, String);
  return AdminCollection.updateAsync(_id, { ...data });
}

export async function remove(_id: string) {
  check(_id, String);
  return AdminCollection.removeAsync(_id);
}

export async function findById(_id: string) {
  check(_id, String);
  return AdminCollection.findOneAsync(_id);
}

Meteor.methods({
  'Admin.create': create,
  'Admin.update': update,
  'Admin.remove': remove,
  'Admin.find': findById
});
