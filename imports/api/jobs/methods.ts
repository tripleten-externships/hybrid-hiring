import { requireAdminAsync } from '../admin/collection';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { JobsCollection } from './collection';
import { Job } from './collection';
import { sampleJobs } from './sample';
import { createJobMatchNotifications } from '../notifications/helpers';

Meteor.methods({
  async 'jobs.create'(jobData: Omit<Job, 'owner' | 'postedAt' | 'isActive'>) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await requireAdminAsync(this.userId);

    check(jobData.title, String);
    check(jobData.company, String);
    check(jobData.location, String);
    check(jobData.basePay, Number);
    check(jobData.payMax, Match.Optional(Number));
    check(jobData.payUnit, Match.OneOf('hourly', 'salary'));
    check(jobData.jobType, Match.OneOf('full-time', 'part-time', 'contract'));
    check(jobData.tags, [String]);
    check(jobData.benefits, [String]);
    check(jobData.description, String);
    check(jobData.externalApplyUrl, String);

    const newJob = {
      ...jobData,
      postedAt: new Date(),
      isActive: true,
      owner: this.userId,
    };
    const jobId = await JobsCollection.insertAsync(newJob);
    await createJobMatchNotifications(newJob, jobId);
    return jobId;
  },

  async 'jobs.update'(jobId: string, updates: Partial<Job>) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await requireAdminAsync(this.userId);

    check(jobId, String);
    check(updates, {
      title: Match.Optional(String),
      company: Match.Optional(String),
      description: Match.Optional(String),
      location: Match.Optional(String),
      basePay: Match.Optional(Number),
      payUnit: Match.Optional(Match.OneOf('hourly', 'salary')),
      payMax: Match.Optional(Number),
      jobType: Match.Optional(Match.OneOf('full-time', 'part-time', 'contract')),
      tags: Match.Optional([String]),
      benefits: Match.Optional([String]),
      externalApplyUrl: Match.Optional(String),
      isActive: Match.Optional(Boolean),
    });

    return JobsCollection.updateAsync({ _id: jobId }, { $set: updates });
  },

  async 'jobs.remove'(jobId: string) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await requireAdminAsync(this.userId);

    check(jobId, String);
    return JobsCollection.removeAsync({ _id: jobId });
  },

  /**
   * Dev/admin helper: inserts any sample jobs not already in the database
   * (matched by title + company). Safe to call multiple times.
   * Usage from browser console: await Meteor.callAsync('jobs.seed')
   */
  async 'jobs.seed'() {
    if (Meteor.isServer) {
      await requireAdminAsync(this.userId ?? undefined);
    }

    let inserted = 0;
    for (const job of sampleJobs) {
      const exists = await JobsCollection.findOneAsync({
        title: job.title,
        company: job.company,
      });
      if (!exists) {
        const jobId = await JobsCollection.insertAsync(job);
        await createJobMatchNotifications(job, jobId);
        inserted++;
      }
    }
    return { inserted, total: sampleJobs.length };
  },
});
