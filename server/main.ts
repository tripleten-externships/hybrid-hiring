import '/imports/api/admin';
import '/imports/api/admin';
import '/imports/api/admin';
import {Meteor} from 'meteor/meteor';
import {AdminCollection} from '../imports/api/admin/collection';
import dotenv from 'dotenv';

dotenv.config();

Meteor.startup(async () => {
  const adminEmail = process.env.ADMIN_EMAIL;

 if (adminEmail) {
    const user = await Meteor.users.findOneAsync({
      emails: { $elemMatch: { address: adminEmail } }
    });

    if (user ) {
      await AdminCollection.insertAsync({
        userId: user._id,
        name: user?.emails?.[0]?.address || 'Admin',
        createdAt: new Date(),
      });
      console.log(`Admin seeded: ${adminEmail}`);
    }
  }
});
