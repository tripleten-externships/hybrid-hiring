import { Mongo } from 'meteor/mongo';

export interface UserProfile {
  _id?: string;
  userId: string;

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
}

export const ProfilesCollection = new Mongo.Collection<UserProfile>('profiles');
