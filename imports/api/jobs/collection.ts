import { Mongo } from 'meteor/mongo';

export interface Job {
  title: string;
  company: string;
  location: string;
  basePay: number;
  payMax?: number;
  payUnit: 'hourly' | 'salary';
  jobType: 'full-time' | 'part-time' | 'contract';
  tags: string[];
  benefits: string[];
  description: string;
  postedAt: Date;
  externalApplyUrl: string;
  isActive: boolean;
}

export const JobsCollection = new Mongo.Collection<Job>('jobs');
