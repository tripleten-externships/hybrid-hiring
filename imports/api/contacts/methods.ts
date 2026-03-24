import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'Contacts.submit'(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  }) {
    /*Note: This implementation depends on Contacts.submit (HH-101). A temporary implementation may be used until HH-101 is completed.*/

    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.message) {
      throw new Meteor.Error('400', 'All fields are required');
    }
    console.log('Contact form submitted:', data);

    return true;
  },
});
