import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { requireAdminAsync } from '../admin/collection';
import { SettingsCollection, SETTINGS_DOC_ID } from './collection';
import type { AppSettings } from './collection';

Meteor.methods({
  async 'settings.update'(updates: Partial<AppSettings>) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    await requireAdminAsync(this.userId);

    check(updates, {
      showSocials: Match.Optional(Boolean),
      socialLinks: Match.Optional({
        facebook: String,
        linkedin: String,
        instagram: String,
      }),
      contact: Match.Optional({
        phone: String,
        email: String,
      }),
      testimonial: Match.Optional({
        quote: String,
        authorName: String,
        authorTitle: String,
      }),
    });

    return SettingsCollection.upsertAsync(
      { _id: SETTINGS_DOC_ID },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  },
});
