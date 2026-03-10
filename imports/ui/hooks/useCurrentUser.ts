import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe, useFind } from 'meteor/react-meteor-data';
import { AdminCollection } from '../../api/admin/collection';
import { ProfileCollection } from '../../api/profile/collection';

export const useCurrentUser = () => {
  return useTracker(() => Meteor.user(), []);
};

export const useUserId = () => {
  return useTracker(() => Meteor.userId(), []);
};

export const useIsLoggedIn = () => {
  return useTracker(() => !!Meteor.userId(), []);
};

export const useMyProfile = () => {
  const userId = useUserId();
  const isLoading = useSubscribe(userId ? 'myProfile' : undefined);
  const profiles = useFind(() => ProfileCollection.find({ userId: userId ?? undefined }), [userId]);
  return { profile: profiles[0], isLoading: isLoading() };
};

export const useAuthenticatedUserIsAdmin = () => {
  const { profile, isLoading } = useMyProfile();
  return { isAdmin: profile ? profile.role === 'admin' : false, isLoading };
};

export const useIsAdmin = () => {
  const userId = useUserId();
  const isLoading = useSubscribe(userId ? 'myAdminRecord' : undefined);
  const admins = useFind(() => AdminCollection.find({ userId: userId ?? undefined }), [userId]);
  return { isAdmin: admins.length > 0, isLoading: isLoading() };
};
