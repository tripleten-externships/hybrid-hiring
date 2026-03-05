import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DemoUsersCollection } from './collection';

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
 * Publication: 'demoUsers.all'
 *
 * Publishes every document in the DemoUsersCollection to any connected client.
 * No arguments are required. On the client, subscribe with:
 *
 *   const isLoading = useSubscribe('demoUsers.all');
 */
Meteor.publish('demoUsers.all', function publishAllDemoUsers() {
  return DemoUsersCollection.find({}, { sort: { createdAt: -1 } });
});

/**
 * Publication: 'demoUsers.byName'
 *
 * Publishes only the demoUsers whose name contains the given search string.
 * Demonstrates how to accept and validate a parameter from the client.
 * On the client, subscribe with:
 *
 *   const isLoading = useSubscribe('demoUsers.byName', searchTerm);
 *
 * @param nameFilter - A string to match against the `name` field (case-insensitive).
 */
Meteor.publish('demoUsers.byName', function publishDemoUsersByName(nameFilter: string) {
  // Always validate arguments coming from the client — never trust the client.
  check(nameFilter, String);

  return DemoUsersCollection.find(
    { name: { $regex: nameFilter, $options: 'i' } },
    { sort: { createdAt: -1 } }
  );
});
