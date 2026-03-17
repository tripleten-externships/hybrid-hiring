import { requireAdmin } from '../admin/collection';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { JobsCollection } from './collection';


Meteor.methods({

    'jobs.create'(jobData) {
        requireAdmin(this.userId!);
        return JobsCollection.insert({
            ...jobData,
            created_at: new Date(),
        });
    },

    "jobs.update"(jobId, updates) {
        requireAdmin(this.userId!);
        check(jobId, String);
        check(updates, {
            title: Match.Optional(String),
            description: Match.Optional(String),
            location: Match.Optional(String),
            salary: Match.Optional(Number),
        });

        return JobsCollection.update({ _id: jobId }, { $set: updates });
    },

    "jobs.remove"(jobId) {
        requireAdmin(this.userId!);
        check(jobId, String);   
        return JobsCollection.remove({ _id: jobId });
    }

});

