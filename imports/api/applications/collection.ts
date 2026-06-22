import { Mongo } from 'meteor/mongo';

export type ApplicationStatus = 'submitted';

export interface Application {
  _id?: string;
  jobId: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  createdAt: Date;
}

export const ApplicationsCollection = new Mongo.Collection<Application>('applications');
