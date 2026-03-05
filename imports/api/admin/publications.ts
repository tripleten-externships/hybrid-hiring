import { Meteor} from 'meteor/meteor';
import { AdminCollection } from './collection';

Meteor.publish('allAdmins', function publishAdmins() {
  return AdminCollection.find({});
});
