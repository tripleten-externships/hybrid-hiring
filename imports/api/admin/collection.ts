import { Mongo } from 'meteor/mongo';

export type Admin = {
  _id?: string;
  name: string;
  createdAt: Date;
  userId: string;
};

export const AdminCollection = new Mongo.Collection<Admin, Admin>('admin');
