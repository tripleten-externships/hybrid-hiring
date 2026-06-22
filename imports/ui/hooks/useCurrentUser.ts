import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe, useFind } from 'meteor/react-meteor-data';
import { AdminCollection } from '../../api/admin/collection';
import { ProfilesCollection } from '../../api/profiles/collection';
import { ApplicationsCollection } from '../../api/applications/collection';
import { SettingsCollection, DEFAULT_SETTINGS, SETTINGS_DOC_ID } from '../../api/settings/collection';
import type { AppSettings } from '../../api/settings/collection';

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
  const isLoading = useSubscribe(userId ? 'userProfiles.getCurrentUser' : undefined);
  const profiles = useFind(
    () => ProfilesCollection.find({ userId: userId ?? undefined }),
    [userId]
  );
  return { profile: profiles[0], isLoading: isLoading() };
};

export const useIsAdmin = () => {
  const userId = useUserId();
  const isLoading = useSubscribe(userId ? 'myAdminRecord' : undefined);
  const admins = useFind(() => AdminCollection.find({ userId: userId ?? undefined }), [userId]);
  return { isAdmin: admins.length > 0, isLoading: isLoading() };
};

/** Reactive set of job ids the current user has already applied to. */
export const useMyAppliedJobIds = (): Set<string> => {
  const userId = useUserId();
  useSubscribe(userId ? 'applications.mine' : undefined);
  const applications = useFind(
    () => ApplicationsCollection.find({ userId: userId ?? undefined }),
    [userId]
  );
  return new Set(applications.map((a) => a.jobId));
};

/** Reactive global site settings, falling back to defaults before load. */
export const useAppSettings = (): AppSettings => {
  useSubscribe('settings.app');
  const docs = useFind(() => SettingsCollection.find({ _id: SETTINGS_DOC_ID }), []);
  return docs[0] ?? DEFAULT_SETTINGS;
};
