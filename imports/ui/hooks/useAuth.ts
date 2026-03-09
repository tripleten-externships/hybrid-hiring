import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

type AuthUser = Meteor.User & { isAdmin?: boolean };

interface UseAuthResult {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId: string | null;
  logOut: () => void;
}

export const useAuth = (): UseAuthResult => {
  const { isLoggedIn, isAdmin, userId } = useTracker(() => {
    const userId = Meteor.userId();
    const user = Meteor.user() as AuthUser | null;
    return {
      userId,
      isLoggedIn: !!userId,
      isAdmin: !!user?.isAdmin,
    };
  });

  const logOut = () => Meteor.logout();

  return { isLoggedIn, isAdmin, userId, logOut };
};
