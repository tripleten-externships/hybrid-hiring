import { Mongo } from 'meteor/mongo';

export type Profile = {
  _id?: string;
  userId: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
};

export const ProfileCollection = new Mongo.Collection<Profile, Profile>('profile');
