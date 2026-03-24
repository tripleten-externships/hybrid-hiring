import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export type Admin = {
  _id?: string;
  userId: string;
  name: string;
  createdAt: Date;
};

export const AdminCollection = new Mongo.Collection<Admin, Admin>('admin');

export const isAdmin = (userId: string) => {
  return !!AdminCollection.findOne({ userId });
};

export const requireAdmin = (userId?: string) => {
  if (!userId || !isAdmin(userId)) {
    throw new Meteor.Error('not-authorized');
  }
};
