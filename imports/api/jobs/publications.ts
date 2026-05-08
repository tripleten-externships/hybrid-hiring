import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { JobsCollection, Job } from './collection';
import { JobType } from '../../types/jobs';
import { ProfilesCollection } from '../profiles/collection';

Meteor.publish('jobs.all', function () {
  return JobsCollection.find({ isActive: true });
});

Meteor.publish('jobs.search', function (query: string, jobType: JobType | '') {
  const searchRegex = new RegExp(query, 'i');

  const filter: Mongo.Query<Job> = {
    isActive: true,
    $or: [{ title: searchRegex }, { company: searchRegex }],
  };
  if (jobType) {
    filter.jobType = jobType;
  }
  return JobsCollection.find(filter);
});

Meteor.publish('jobs.recommended', async function () {
  if (!this.userId) {
    return this.ready();
  }
  const profile = await ProfilesCollection.findOneAsync({ userId: this.userId });

  if (!profile) {
    return this.ready();
  }

  return JobsCollection.find({
    isActive: true,
    jobType: { $in: profile.jobTypes },
    basePay: { $gte: profile.minPay },
  });
});

Meteor.publish('jobs.byId', function (jobId: string) {
  return JobsCollection.find({ _id: jobId });
});
