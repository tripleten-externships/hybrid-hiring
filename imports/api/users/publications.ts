import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { UsersCollection } from './collection';

/**
 * HOW METEOR PUBLICATIONS WORK
 * ----------------------------
 * A publication is a server-side function that determines which documents
 * a connected client is allowed to see. The client subscribes by name, and
 * Meteor keeps the client's local Minimongo cache in sync automatically.
 *
 * Key rules:
 *  - Return a Mongo cursor (or array of cursors) to stream documents reactively.
 *  - Use `check()` to validate any arguments passed from the client.
 *  - Use `this.userId` to scope data to the currently logged-in user.
 *  - Call `this.ready()` when you need to signal readiness manually (no cursor).
 */

/**
 * Publication: 'users.all'
 *
 * Publishes every document in the UsersCollection to any connected client.
 * No arguments are required. On the client, subscribe with:
 *
 *   const isLoading = useSubscribe('users.all');
 */
Meteor.publish('users.all', function publishAllUsers() {
  return UsersCollection.find(
    {},
    { sort: { createdAt: -1 } }
  );
});

/**
 * Publication: 'users.byName'
 *
 * Publishes only the users whose name contains the given search string.
 * Demonstrates how to accept and validate a parameter from the client.
 * On the client, subscribe with:
 *
 *   const isLoading = useSubscribe('users.byName', searchTerm);
 *
 * @param nameFilter - A string to match against the `name` field (case-insensitive).
 */
Meteor.publish('users.byName', function publishUsersByName(nameFilter: string) {
  // Always validate arguments coming from the client — never trust the client.
  check(nameFilter, String);

  return UsersCollection.find(
    { name: { $regex: nameFilter, $options: 'i' } },
    { sort: { createdAt: -1 } }
  );
});
