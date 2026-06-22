import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { ProfilesCollection } from '../profiles/collection';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AccountsPasswordServer = typeof Accounts & {
  _checkPasswordUserFields?: Record<string, 1>;
  _checkPasswordAsync: (
    user: Meteor.User,
    password: string
  ) => Promise<{ userId: string; error?: Meteor.Error }>;
  addEmailAsync: (userId: string, newEmail: string, verified?: boolean) => Promise<void>;
  removeEmail: (userId: string, email: string) => Promise<void>;
};

const AccountsPassword = Accounts as AccountsPasswordServer;

async function verifyCurrentPassword(userId: string, password: string) {
  const user = await Meteor.users.findOneAsync(userId, {
    fields: {
      services: 1,
      ...(AccountsPassword._checkPasswordUserFields ?? { _id: 1 }),
    },
  });

  if (!user) {
    throw new Meteor.Error('not-found', 'User not found.');
  }

  const result = await AccountsPassword._checkPasswordAsync(user, password);
  if (result.error) {
    throw new Meteor.Error('incorrect-password', 'Current password is incorrect.');
  }
}

Meteor.methods({
  async 'accounts.updateName'(firstName: string, lastName: string) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Please sign in to update your name.');
    }

    check(firstName, String);
    check(lastName, String);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst) {
      throw new Meteor.Error('invalid-name', 'First name is required.');
    }
    if (!trimmedLast) {
      throw new Meteor.Error('invalid-name', 'Last name is required.');
    }

    const fullName = `${trimmedFirst} ${trimmedLast}`;

    await Meteor.users.updateAsync(this.userId, {
      $set: {
        'profile.firstName': trimmedFirst,
        'profile.lastName': trimmedLast,
        'profile.name': fullName,
      },
    });

    const profile = await ProfilesCollection.findOneAsync({ userId: this.userId });
    if (profile?._id) {
      await ProfilesCollection.updateAsync(profile._id, {
        $set: { name: fullName, updatedAt: new Date() },
      });
    }

    return { name: fullName };
  },

  async 'accounts.changeEmail'(newEmail: string, currentPassword: string) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Please sign in to update your email.');
    }

    check(newEmail, String);
    check(currentPassword, String);

    const normalizedEmail = newEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Meteor.Error('invalid-email', 'Email is required.');
    }
    if (!EMAIL_RE.test(normalizedEmail)) {
      throw new Meteor.Error('invalid-email', 'Please enter a valid email address.');
    }

    const user = await Meteor.users.findOneAsync(this.userId);
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found.');
    }

    await verifyCurrentPassword(this.userId, currentPassword);

    const currentEmailAddress = user.emails?.[0]?.address;
    if (currentEmailAddress?.toLowerCase() === normalizedEmail) {
      throw new Meteor.Error('same-email', 'That is already your email address.');
    }

    const existing = await Meteor.users.findOneAsync({
      _id: { $ne: this.userId },
      emails: { $elemMatch: { address: normalizedEmail } },
    });
    if (existing) {
      throw new Meteor.Error('email-exists', 'An account with this email already exists.');
    }

    if (currentEmailAddress) {
      await AccountsPassword.removeEmail(this.userId, currentEmailAddress);
    }
    await AccountsPassword.addEmailAsync(this.userId, normalizedEmail, true);

    return { email: normalizedEmail };
  },
});
