import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from './collection';
import { requireAdmin } from '/imports/api/admin/collection';

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

  if (!firstName || !email || !message) {
    throw new Meteor.Error('validation-error', 'Missing required fields');
  }

  return await ContactsCollection.insertAsync({
    firstName,
    lastName: lastName || '',
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
