import { Meteor } from 'meteor/meteor';
import { JobsCollection } from './collection';

Meteor.publish('jobs.all', function () {
    return JobsCollection.find({ isActive: true });
});