import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from './collection';
import { isAdminAsync } from '/imports/api/admin/collection';

Meteor.publish('contacts.all', async function () {
  if (!this.userId || !(await isAdminAsync(this.userId))) {
    return this.ready();
  }

  return ContactsCollection.find({}, { sort: { submittedAt: -1 } });
});
