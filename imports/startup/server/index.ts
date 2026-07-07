import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Link, LinksCollection } from '../../api/links';
import { DemoUsersCollection } from '../../api/demo-users/collection';
import { AdminCollection } from '../../api/admin/collection';
import { sampleJobs } from '../../api/jobs/sample';
import { shouldSeedSampleJobs } from '../../api/jobs/seedPolicy';
import { JobsCollection } from '../../api/jobs/collection';
import {
  SettingsCollection,
  DEFAULT_SETTINGS,
  SETTINGS_DOC_ID,
} from '../../api/settings/collection';
import '../../api/contacts/methods';
import '../../api/contacts/publications';
import '../../api/accounts/config';
import './staticCdnSettings';
import './staticCache';
import './htmlAttributes';

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
      const existingAdmin = await AdminCollection.findOneAsync({ userId: user._id });
      if (!existingAdmin) {
        await AdminCollection.insertAsync({
          userId: user._id,
          name: user?.emails?.[0]?.address || 'Admin',
          createdAt: new Date(),
        });
        console.log(`Admin seeded: ${adminEmail}`);
      }
    }
  }

  // Seed the Links collection with sample data if it is empty.
  if ((await LinksCollection.find().countAsync()) === 0) {
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

  // Seed sample jobs in development only (never in production).
  if (shouldSeedSampleJobs() && (await JobsCollection.find().countAsync()) === 0) {
    for (const job of sampleJobs) {
      await JobsCollection.insertAsync(job);
    }
    console.log('Sample jobs inserted into the database (development only).');
  }

  // Seed the global site-settings document if it does not exist yet.
  if (!(await SettingsCollection.findOneAsync({ _id: SETTINGS_DOC_ID }))) {
    await SettingsCollection.insertAsync({ ...DEFAULT_SETTINGS, updatedAt: new Date() });
    console.log('Global site settings seeded.');
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

  // Keep this callback synchronous. An `async` callback returns a Promise that
  // Meteor treats as "truthy" (i.e. allowed), and anything it throws becomes an
  // unhandled rejection that can crash/restart the server — which the client
  // experiences as a full page reload on failed login.
  Accounts.validateLoginAttempt((info: Accounts.IValidateLoginAttemptCbOpts) => {
    // Only enforce our one custom rule: block locked accounts. We deliberately
    // do NOT throw for unknown users or missing emails — those attempts have
    // already failed with Meteor's own 403, and overriding it would (a) leak
    // whether an account exists and (b) give inconsistent client messages.
    if (info.user && (info.user as { locked?: boolean }).locked) {
      throw new Meteor.Error(
        'account-locked',
        'This account has been locked. Please contact support.'
      );
    }
    // Return Meteor's existing verdict untouched. Returning `true` here never
    // resurrects an already-failed attempt; it just avoids adding a denial.
    return info.allowed;
  });
});
