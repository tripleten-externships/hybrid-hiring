import { Mongo } from 'meteor/mongo';

export type NotificationType = 'job_match' | 'announcement';

export interface Notification {
  _id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  jobId?: string;
  read: boolean;
  createdAt: Date;
}

export const NotificationsCollection = new Mongo.Collection<Notification>('notifications');
