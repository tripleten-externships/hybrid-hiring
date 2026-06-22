import { Meteor } from 'meteor/meteor';
import { SettingsCollection, SETTINGS_DOC_ID } from './collection';

/** Public: the single global settings document. All fields are public-facing
 *  content (social links, contact info, testimonial, visibility flag). */
Meteor.publish('settings.app', function () {
  return SettingsCollection.find({ _id: SETTINGS_DOC_ID });
});
