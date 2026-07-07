import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { AdminCollection } from '../../api/admin/collection';
import { ProfilesCollection } from '../../api/profiles/collection';
import { ApplicationsCollection } from '../../api/applications/collection';
import {
  SettingsCollection,
  DEFAULT_SETTINGS,
  SETTINGS_DOC_ID,
} from '../../api/settings/collection';
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

  const profile = useTracker(() => {
    if (!userId) return undefined;
    return ProfilesCollection.findOne({ userId });
  }, [userId]);

  return { profile, isLoading: isLoading() };
};

export const useIsAdmin = () => {
  const userId = useUserId();
  const isLoading = useSubscribe(userId ? 'myAdminRecord' : undefined);

  const isAdmin = useTracker(() => {
    if (!userId) return false;
    return AdminCollection.find({ userId }).count() > 0;
  }, [userId]);

  return { isAdmin, isLoading: isLoading() };
};

/** Reactive set of job ids the current user has already applied to. */
export const useMyAppliedJobIds = (): Set<string> => {
  const userId = useUserId();
  useSubscribe(userId ? 'applications.mine' : undefined);

  return useTracker(() => {
    if (!userId) return new Set<string>();
    const applications = ApplicationsCollection.find({ userId }).fetch();
    return new Set(applications.map((a) => a.jobId));
  }, [userId]);
};

/** Reactive global site settings, falling back to defaults before load. */
export const useAppSettings = (): AppSettings => {
  useSubscribe('settings.app');

  return useTracker(() => {
    return SettingsCollection.findOne({ _id: SETTINGS_DOC_ID }) ?? DEFAULT_SETTINGS;
  }, []);
};
