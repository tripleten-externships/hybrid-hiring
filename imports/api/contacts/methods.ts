import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { ContactsCollection } from './collection';
import { requireAdmin } from '../admin/collection';

async function submit(
  this: Meteor.MethodThisType,
  data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    message: string;
  }
) {
  const { firstName, lastName, email, phone, message } = data;

  check(firstName, String);
  check(email, String);
  check(message, String);
  check(lastName, Match.Optional(String));
  check(phone, Match.Optional(String));

  return await ContactsCollection.insertAsync({
    firstName,
    lastName,
    email,
    phone,
    message,
    submittedAt: new Date(),
  });
}

async function remove(this: Meteor.MethodThisType, contactId: string) {
  requireAdmin(this.userId ?? undefined);

  return await ContactsCollection.removeAsync({ _id: contactId });
}

Meteor.methods({
  'contacts.submit': submit,
  'contacts.remove': remove,
});
