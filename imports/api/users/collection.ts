import { Mongo } from 'meteor/mongo';

export type Users = {
  _id?: string;
  name: string;
  createdAt: Date;
}

export const UsersCollection = new Mongo.Collection<Users, Users>('users');
