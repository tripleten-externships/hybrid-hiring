import { requireAdmin } from '../admin/collection';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { JobsCollection } from './collection';
import { Job } from './collection';

Meteor.methods({
  'jobs.create'(jobData: Omit<Job, 'owner' | 'postedAt' | 'isActive'>) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    requireAdmin(this.userId!);
    
    check(jobData.title, String);
    check(jobData.company, String);
    check(jobData.location, String);
    check(jobData.basePay, Number);
    check(jobData.payUnit, Match.OneOf('hourly', 'salary'));
    check(jobData.jobType, Match.OneOf('full-time', 'part-time', 'contract'));
    check(jobData.tags, [String]);
    check(jobData.benefits, [String]);
    check(jobData.description, String);
    check(jobData.externalApplyUrl, String);

    return JobsCollection.insert({
      ...jobData,
      postedAt: new Date(),
      isActive: true,
      owner: this.userId!,
    });
  },

  'jobs.update'(jobId: string, updates: Partial<Job>) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    requireAdmin(this.userId!);
    
    check(jobId, String);
    check(updates, {
      title: Match.Optional(String),
      description: Match.Optional(String),
      location: Match.Optional(String),
      payUnit: Match.Optional(Match.OneOf('hourly', 'salary')),
      payMax: Match.Optional(Number),
      jobType: Match.Optional(Match.OneOf('full-time', 'part-time', 'contract')),
      tags: Match.Optional([String]),
      benefits: Match.Optional([String]),
      externalApplyUrl: Match.Optional(String),
      isActive: Match.Optional(Boolean),
    });
    

    return JobsCollection.update({ _id: jobId }, { $set: updates });
  },

  'jobs.remove'(jobId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    requireAdmin(this.userId!);
    
    check(jobId, String);
    return JobsCollection.remove({ _id: jobId });
  },
});
