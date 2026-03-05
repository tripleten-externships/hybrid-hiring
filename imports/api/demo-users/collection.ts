import { Mongo } from 'meteor/mongo';

export type DemoUser = {
  _id?: string;
  name: string;
  createdAt: Date;
};

export const DemoUsersCollection = new Mongo.Collection<DemoUser, DemoUser>('demoUsers');
