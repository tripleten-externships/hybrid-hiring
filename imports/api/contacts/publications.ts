import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from './collection';
import { isAdmin } from '/imports/api/admin/collection';

Meteor.publish('contacts.all', function () {
  if (!this.userId || !isAdmin(this.userId)) {
    return this.ready();
  }

  return ContactsCollection.find({}, { sort: { submittedAt: -1 } });
});
