import { Mongo } from 'meteor/mongo';

export interface ContactSubmission {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: Date;
}

export const ContactsCollection = new Mongo.Collection<ContactSubmission>('contacts');
console.log('ContactsCollection initialized:', ContactsCollection);
