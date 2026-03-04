import { useState } from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { DemoUsersCollection } from '../../api/demo-users/collection';

/**
 * HOW METEOR SUBSCRIPTIONS WORK
 * ------------------------------
 * `useSubscribe(publicationName, ...args)` tells the server to start sending
 * documents for the named publication. Meteor keeps your local Minimongo cache
 * in sync automatically for as long as the component is mounted.
 *
 * `useFind(() => Collection.find(...))` runs a reactive query against that
 * local cache and re-renders the component whenever the data changes.
 *
 * The two hooks work together:
 *   useSubscribe  →  controls WHICH documents flow from server to client
 *   useFind       →  reads those documents from the client-side cache
 */
export const DemoUsersList = () => {
  const [search, setSearch] = useState('');

  /**
   * Switch between the two publications based on whether the user has typed
   * a search term:
   *
   *  'demoUsers.all'    — no arguments, streams every user document
   *  'demoUsers.byName' — passes `search` to the server for server-side filtering
   *
   * `isLoading` is a function that returns `true` while the initial batch of
   * documents is still being sent. Use it to show a loading state.
   */
  const isLoading = useSubscribe(search ? 'demoUsers.byName' : 'demoUsers.all', search);

  /**
   * `useFind` runs reactively: whenever the server pushes an insert, update,
   * or remove for this subscription, the component re-renders automatically.
   */
  const users = useFind(
    () =>
      DemoUsersCollection.find(search ? { name: { $regex: search, $options: 'i' } } : {}, {
        sort: { createdAt: -1 },
      }),
    [search]
  );

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '2rem auto' }}>
      <h2>Users List — Pub/Sub Demo</h2>

      {/* Changing this input switches the active subscription on the fly */}
      <input
        type="text"
        placeholder="Filter by name (uses demoUsers.byName publication)…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', boxSizing: 'border-box' }}
      />

      {/* Only show the loading state on initial hydration, not between subscription switches */}
      {isLoading() && users.length === 0 ? (
        <p>Loading…</p>
      ) : users.length === 0 ? (
        <p>No demo users found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li
              key={user._id}
              style={{
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{user.name}</span>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>
                {user.createdAt.toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '1rem' }}>
        Active publication:{' '}
        <code>{search ? `demoUsers.byName("${search}")` : 'demoUsers.all'}</code>
      </p>
    </div>
  );
};
