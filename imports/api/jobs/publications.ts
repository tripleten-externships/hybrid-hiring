import { Meteor } from 'meteor/meteor';
import { JobsCollection } from './collection';
import { ProfilesCollection } from '../profiles/collection';

Meteor.publish('jobs.all', function () {
  return JobsCollection.find({ isActive: true });
});

Meteor.publish('jobs.search', function (query: string, jobType: string) {
  // line 11 for testing purposes
  console.log('jobs.search called');
  const searchRegex = new RegExp(query, 'i');

  const filter: any = {
    isActive: true,
    $or: [{ title: searchRegex }, { company: searchRegex }],
  };
  if (jobType) {
    filter.jobType = jobType;
  }
  return JobsCollection.find(filter);
});

Meteor.publish('jobs.recommended', function () {
  if (!this.userId) {
    return this.ready();
  }
  const profile = ProfilesCollection.findOne({ userId: this.userId });

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
