import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { UsersCollection } from '../api/users/collection';

/**
 * HOW METEOR METHODS ARE CALLED FROM THE CLIENT
 * -----------------------------------------------
 * `Meteor.callAsync('methodName', ...args)` sends a DDP message to the server
 * and returns a Promise that resolves with the method's return value, or rejects
 * with a `Meteor.Error` if the method throws.
 *
 * In Meteor 3.x, always use `callAsync` (never the old callback-based `call`).
 *
 * The reactive loop this component demonstrates:
 *
 *   User action
 *     → Meteor.callAsync('Users.create', ...)   [method call — write]
 *       → server inserts into MongoDB
 *         → Meteor pushes the new doc to all subscribers
 *           → useFind re-renders the list automatically  [subscription — read]
 *
 * This component intentionally combines both patterns so you can see them
 * interact. For isolated examples see UsersList.tsx (subscriptions) and
 * imports/api/users/methods.ts (server-side method definitions).
 */
export const UsersManager = () => {
  const [newName, setNewName]       = useState('');
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [status, setStatus]         = useState<{ text: string; ok: boolean } | null>(null);

  // -------------------------------------------------------------------------
  // Subscription — keeps the local cache in sync with the server.
  // The list below updates automatically after any method call succeeds.
  // -------------------------------------------------------------------------
  const isLoading = useSubscribe('users.all');
  const users = useFind(() => UsersCollection.find({}, { sort: { createdAt: -1 } }));

  // -------------------------------------------------------------------------
  // Helper: show a brief status message, then clear it after 3 seconds.
  // -------------------------------------------------------------------------
  const flash = (text: string, ok = true) => {
    setStatus({ text, ok });
    setTimeout(() => setStatus(null), 3000);
  };

  // -------------------------------------------------------------------------
  // CREATE — calls 'Users.create' method
  // -------------------------------------------------------------------------
  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;

    try {
      /**
       * `Meteor.callAsync` is the Meteor 3.x way to invoke a method.
       * It returns a Promise — await it just like any async function.
       * The server validates the arguments and writes to MongoDB.
       */
      await Meteor.callAsync('Users.create', { name, createdAt: new Date() });
      setNewName('');
      flash('User created.');
    } catch (err: unknown) {
      // Meteor methods throw `Meteor.Error` on validation or server failures.
      flash(err instanceof Meteor.Error ? err.reason ?? err.message : String(err), false);
    }
  };

  // -------------------------------------------------------------------------
  // UPDATE — calls 'Users.update' method with a $set modifier
  // -------------------------------------------------------------------------
  const handleUpdate = async (id: string) => {
    const name = editingName.trim();
    if (!name) return;

    try {
      /**
       * Pass a standard Mongo modifier as the second argument.
       * The server validates the _id and modifier before applying the update.
       */
      await Meteor.callAsync('Users.update', id, { $set: { name } });
      setEditingId(null);
      flash('User renamed.');
    } catch (err: unknown) {
      flash(err instanceof Meteor.Error ? err.reason ?? err.message : String(err), false);
    }
  };

  // -------------------------------------------------------------------------
  // DELETE — calls 'Users.remove' method
  // -------------------------------------------------------------------------
  const handleRemove = async (id: string) => {
    try {
      await Meteor.callAsync('Users.remove', id);
      flash('User removed.');
    } catch (err: unknown) {
      flash(err instanceof Meteor.Error ? err.reason ?? err.message : String(err), false);
    }
  };

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------
  const s = styles;

  return (
    <div style={s.container}>
      <h2 style={{ marginTop: 0 }}>Users Manager — Methods Demo</h2>

      {/* CREATE form */}
      <div style={s.row}>
        <input
          style={s.input}
          type="text"
          placeholder="New user name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button style={s.btnPrimary} onClick={handleCreate}>
          Add User
        </button>
      </div>

      {/* Status feedback */}
      {status && (
        <p style={{ ...s.status, color: status.ok ? '#2a7a2a' : '#c0392b' }}>
          {status.text}
        </p>
      )}

      {/* User list */}
      {isLoading() ? (
        <p>Loading…</p>
      ) : users.length === 0 ? (
        <p style={{ color: '#888' }}>No users yet — add one above.</p>
      ) : (
        <ul style={s.list}>
          {users.map((user) => (
            <li key={user._id} style={s.listItem}>
              {editingId === user._id ? (
                /* UPDATE inline editor */
                <div style={{ ...s.row, flex: 1 }}>
                  <input
                    style={s.input}
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate(user._id!);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button style={s.btnPrimary} onClick={() => handleUpdate(user._id!)}>Save</button>
                  <button style={s.btnSecondary} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                /* Read view */
                <>
                  <span style={{ flex: 1 }}>{user.name}</span>
                  <span style={s.date}>{user.createdAt.toLocaleDateString()}</span>
                  <button
                    style={s.btnSecondary}
                    onClick={() => { setEditingId(user._id!); setEditingName(user.name); }}
                  >
                    Rename
                  </button>
                  <button style={s.btnDanger} onClick={() => handleRemove(user._id!)}>
                    Remove
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <p style={s.hint}>
        Every button calls a <code>Meteor.callAsync</code> method on the server.
        The list updates automatically via the <code>users.all</code> subscription.
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Styles (plain objects — no extra dependencies needed)
// ---------------------------------------------------------------------------
const styles = {
  container: {
    fontFamily: 'sans-serif',
    maxWidth: 520,
    margin: '2rem auto',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: 8,
  } as React.CSSProperties,
  row: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  input: {
    flex: 1,
    padding: '0.4rem 0.6rem',
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: '0.95rem',
  } as React.CSSProperties,
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0.75rem 0',
  } as React.CSSProperties,
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  } as React.CSSProperties,
  date: {
    color: '#888',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  status: {
    margin: '0 0 0.75rem',
    fontSize: '0.9rem',
    fontWeight: 500,
  } as React.CSSProperties,
  hint: {
    marginTop: '1rem',
    color: '#888',
    fontSize: '0.8rem',
  } as React.CSSProperties,
  btnPrimary: {
    padding: '0.4rem 0.8rem',
    background: '#3478f6',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  btnSecondary: {
    padding: '0.4rem 0.8rem',
    background: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  btnDanger: {
    padding: '0.4rem 0.8rem',
    background: '#fff0f0',
    color: '#c0392b',
    border: '1px solid #e0a0a0',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
};
