import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ResumesCollection } from './collection';
import { ProfilesCollection } from '../profiles/collection';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/** Estimates the decoded byte size of a base64 string. */
function base64ByteSize(base64: string): number {
  const len = base64.length;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((len * 3) / 4) - padding;
}

Meteor.methods({
  async 'resumes.upload'(fileName: string, contentType: string, base64: string) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Login required');
    }

    check(fileName, String);
    check(contentType, String);
    check(base64, String);

    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      throw new Meteor.Error('invalid-type', 'Please upload a PDF or Word document.');
    }

    const size = base64ByteSize(base64);
    if (size <= 0) {
      throw new Meteor.Error('empty-file', 'The uploaded file appears to be empty.');
    }
    if (size > MAX_BYTES) {
      throw new Meteor.Error('file-too-large', 'Resume must be 5MB or smaller.');
    }

    const userId = this.userId;
    const existing = await ResumesCollection.findOneAsync({ userId });

    const doc = {
      userId,
      fileName,
      contentType,
      data: base64,
      size,
      uploadedAt: new Date(),
    };

    if (existing && existing._id) {
      await ResumesCollection.updateAsync(existing._id, { $set: doc });
    } else {
      await ResumesCollection.insertAsync(doc);
    }

    // Surface the filename on the profile so the UI can show "resume on file".
    const profile = await ProfilesCollection.findOneAsync({ userId });
    if (profile && profile._id) {
      await ProfilesCollection.updateAsync(profile._id, {
        $set: { resumeUrl: fileName, updatedAt: new Date() },
      });
    } else {
      await ProfilesCollection.insertAsync({
        userId,
        resumeUrl: fileName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return { fileName, size };
  },
});
