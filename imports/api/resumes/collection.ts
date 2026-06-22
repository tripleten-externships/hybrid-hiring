import { Mongo } from 'meteor/mongo';

export interface Resume {
  _id?: string;
  userId: string;
  fileName: string;
  contentType: string;
  /** Base64-encoded file contents. Stored server-side only — never published. */
  data: string;
  size: number;
  uploadedAt: Date;
}

export const ResumesCollection = new Mongo.Collection<Resume>('resumes');
