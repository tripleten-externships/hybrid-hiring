import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Users, UsersCollection } from './collection';

/**
 * HOW METEOR METHODS WORK
 * -----------------------
 * A Meteor method is a named, server-side (RPC) function that the client calls
 * with `Meteor.callAsync('methodName', ...args)`. Methods are the right tool
 * for any write operation or sensitive business logic — unlike direct client-side
 * collection inserts, methods run with full server trust.
 *
 * Key rules:
 *  1. Always validate arguments with `check()` — clients can send anything.
 *  2. Methods defined with `function` (not arrow functions) expose a `this`
 *     context with useful properties like `this.userId` and `this.isSimulation`.
 *  3. In Meteor 3.x, method handlers can be `async` — await freely.
 *  4. Optimistic UI: if you define a matching client-side stub, Meteor applies
 *     it immediately and rolls back if the server returns an error.
 *     See: https://docs.meteor.com/api/methods#Meteor-methods
 *
 * `this.userId`      — the _id of the logged-in user (null if not logged in).
 * `this.isSimulation`— true when running as a client stub (optimistic UI).
 * `this.unblock()`   — allows other methods to run without waiting for this one.
 */

// ---------------------------------------------------------------------------
// Standalone async functions (easier to unit-test in isolation)
// ---------------------------------------------------------------------------

export async function create(data: Omit<Users, '_id'>) {
  check(data, {
    name: String,
    createdAt: Date,
  });
  return UsersCollection.insertAsync({ ...data });
}

export async function update(_id: string, data: Mongo.Modifier<Users>) {
  check(_id, String);
  // Match.ObjectIncluding allows extra keys; use Match.Where for stricter rules.
  check(data, Match.ObjectIncluding({ $set: Object }));
  return UsersCollection.updateAsync(_id, data);
}

export async function remove(_id: string) {
  check(_id, String);
  return UsersCollection.removeAsync(_id);
}

export async function findById(_id: string) {
  check(_id, String);
  return UsersCollection.findOneAsync(_id);
}

// ---------------------------------------------------------------------------
// Method registration
// ---------------------------------------------------------------------------

/**
 * `Meteor.methods` registers each function under a string name.
 * The client calls them by that name via `Meteor.callAsync('Users.create', ...)`.
 *
 * Naming convention: 'CollectionName.action' keeps things discoverable.
 * Dot-notation is just a string — there is no special routing magic.
 */
Meteor.methods({
  /**
   * Users.create
   * Creates a new user document.
   *
   * @param data - { name: string, createdAt: Date }
   * @returns The _id of the newly inserted document.
   *
   * Client call:
   *   const id = await Meteor.callAsync('Users.create', { name: 'Alice', createdAt: new Date() });
   */
  'Users.create': create,

  /**
   * Users.update
   * Updates an existing user document using a standard Mongo modifier.
   *
   * @param _id  - The document's _id.
   * @param data - A Mongo modifier, e.g. `{ $set: { name: 'Bob' } }`.
   *
   * Client call:
   *   await Meteor.callAsync('Users.update', userId, { $set: { name: 'Bob' } });
   */
  'Users.update': update,

  /**
   * Users.remove
   * Deletes a user document by _id.
   *
   * @param _id - The document's _id.
   *
   * Client call:
   *   await Meteor.callAsync('Users.remove', userId);
   */
  'Users.remove': remove,

  /**
   * Users.find
   * Fetches a single user by _id. Useful for one-off server reads outside
   * of a subscription (e.g. server-side logic, admin lookups).
   *
   * Prefer subscriptions + useFind for reactive UI — this is a one-time fetch.
   *
   * @param _id - The document's _id.
   * @returns The user document or undefined.
   *
   * Client call:
   *   const user = await Meteor.callAsync('Users.find', userId);
   */
  'Users.find': findById,
});
