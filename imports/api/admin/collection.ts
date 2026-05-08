import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export type Admin = {
  _id?: string;
  userId: string;
  name: string;
  createdAt: Date;
};

export const AdminCollection = new Mongo.Collection<Admin, Admin>('admin');

export const isAdminAsync = async (userId: string): Promise<boolean> => {
  return !!(await AdminCollection.findOneAsync({ userId }));
};

export const requireAdminAsync = async (userId?: string): Promise<void> => {
  if (!userId || !(await isAdminAsync(userId))) {
    throw new Meteor.Error('not-authorized');
  }
};

/** @deprecated Use isAdminAsync on the server. Safe only for Minimongo (client). */
export const isAdmin = (userId: string): boolean => {
  return !!AdminCollection.findOne({ userId });
};

/** @deprecated Use requireAdminAsync on the server. Safe only for Minimongo (client). */
export const requireAdmin = (userId?: string): void => {
  if (!userId || !isAdmin(userId)) {
    throw new Meteor.Error('not-authorized');
  }
};
