import { Mongo } from 'meteor/mongo';
import { JobType } from '../../types/jobs';

export interface UserProfile {
  _id?: string;
  userId: string;
  name?: string;
  role?: 'admin' | 'user';
  jobTypes?: JobType[];
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
