import { Mongo } from 'meteor/mongo';

export type Profile = {
  _id?: string;
  userId: string;
  name: string;
  role: 'admin' | 'user';
  jobTypes?: string[];
  minPay?: number;
  payUnit?: 'hourly' | 'yearly';
  city?: string;
  state?: string;
  preferredTitle?: string;
  skills?: string[];
  resumeUrl?: string;
  certUrl?: string;
  activelyLooking?: boolean;
  savedJobs?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export const ProfileCollection = new Mongo.Collection<Profile, Profile>('profile');
