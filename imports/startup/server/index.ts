import dotenv from 'dotenv';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link, LinksCollection } from '../../api/links';
import { DemoUsersCollection } from '../../api/demo-users/collection';
import { AdminCollection } from '../../api/admin/collection';

dotenv.config();

async function insertLink({ title, url }: Pick<Link, 'title' | 'url'>) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (adminEmail) {
    const user = await Meteor.users.findOneAsync({
      emails: { $elemMatch: { address: adminEmail } },
    });

    if (user) {
      await AdminCollection.insertAsync({
        userId: user._id,
        name: user?.emails?.[0]?.address || 'Admin',
        createdAt: new Date(),
      });
      console.log(`Admin seeded: ${adminEmail}`);
    }

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // Seed the DemoUsers collection with sample data for the pub/sub demo.
  if ((await DemoUsersCollection.find().countAsync()) === 0) {
    const seedUsers = [
      { name: 'Alice Johnson', createdAt: new Date('2025-01-15') },
      { name: 'Bob Smith', createdAt: new Date('2025-03-22') },
      { name: 'Carol White', createdAt: new Date('2025-06-10') },
    ];

    for (const user of seedUsers) {
      await DemoUsersCollection.insertAsync(user);
    }
  }

  // Publish the entire Links collection to all clients.
  Meteor.publish('links', function () {
    return LinksCollection.find();
  });

  Accounts.validateNewUser((user: Meteor.User) => {
    if (!user) {
      throw new Meteor.Error('invalidData');
    }
    if (!user.emails) {
      throw new Meteor.Error('invalidEmail');
    }
    return true;
  });

  Accounts.validateLoginAttempt(async (info: Accounts.IValidateLoginAttemptCbOpts) => {
    if (!info.user) {
      throw new Meteor.Error('invalidData');
    }
    if (!info.user.emails) {
      throw new Meteor.Error('invalidEmail');
    }
    return true;
  });
});
