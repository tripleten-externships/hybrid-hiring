import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe, useFind } from 'meteor/react-meteor-data';
import { AdminCollection } from '/imports/api/admin/collection.ts';
import { ProfilesCollection } from '/imports/api/profiles/collections.ts';

export const useCurrentUser = () => {
  return useTracker(() => Meteor.user(), []);
};

export const useUserId = () => {
  return useTracker(() => Meteor.userId(), []);
};
export const useIsLoggedIn = () => {
  return useTracker(() => !!Meteor.userId(), []);
};

export const useIsAdmin = () => {
  const userId = useUserId();
  useSubscribe('admin.mine');
  const array = useFind(() => AdminCollection.find({ userId }), [userId]);
  return array.length > 0;
};

export const useMyProfile = () => {
  const userId = useUserId();
  useSubscribe('profiles.mine');
  const array = useFind(() => ProfilesCollection.find({ userId }), [userId]);
  return array[0];
};
