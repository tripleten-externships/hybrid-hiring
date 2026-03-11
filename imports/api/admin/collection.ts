import { Mongo } from 'meteor/mongo';

export type Admin = {
  _id?: string;
  userId: string;
  name: string;
  createdAt: Date;
};

export const AdminCollection = new Mongo.Collection<Admin, Admin>('admin');
