# Hybrid Hiring Solutions

A full-stack Meteor 3.4 application built with React 18 and TypeScript. This codebase serves as a reference implementation for the engineering team, with working examples of Meteor's core patterns — publications, subscriptions, and methods.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Running the App](#3-running-the-app)
4. [Project Structure](#4-project-structure)
5. [Core Concepts](#5-core-concepts)
   - [Publications & Subscriptions](#publications--subscriptions)
   - [Methods](#methods)
6. [Development Workflow](#6-development-workflow)
7. [Git Conventions](#7-git-conventions)
8. [Testing](#8-testing)
9. [Available Scripts](#9-available-scripts)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

You will need the following tools installed before cloning the repo.

### Node.js (via nvm)

This project pins its Node version in `.nvmrc` (**22.22.0**). Using nvm ensures everyone runs the same version.

**Install nvm** (if you don't have it):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then restart your terminal and verify:

```bash
nvm --version
```

### Meteor

Meteor ships its own bundled Node runtime for the build process, but you still need a system-level Node to run the `meteor` CLI.

**Install Meteor:**

```bash
npm install -g meteor
```

Or via the official installer:

```bash
curl https://install.meteor.com/ | sh
```

Verify the install:

```bash
meteor --version
# Expected: Meteor 3.4.x
```

### MongoDB

Meteor bundles a local MongoDB instance that starts automatically when you run `meteor run`. You do **not** need to install MongoDB separately for local development.

If you ever want to connect to an external database (e.g. MongoDB Atlas for staging), set `MONGO_URL` in `.env` — more on that in [Running the App](#3-running-the-app).

---

## 2. Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd hybrid-hiring

# 2. Use the correct Node version (reads from .nvmrc automatically)
nvm use

# 3. Install npm dependencies
npm install
```

> **Note:** The first `npm install` inside a Meteor project also pulls down Meteor's atmosphere packages listed in `.meteor/packages`. This can take a few minutes on a fresh machine.

---

## 3. Running the App

### Environment variables

A `.env` file is included in the repo with defaults for local development:

```
MONGO_URL=mongodb://localhost:27017/
```

This points to the Meteor-bundled local MongoDB. No changes are needed to get started. If you need to override any variable for your machine, edit `.env` directly — do not commit secrets.

### Start the dev server

```bash
npm start
# equivalent to: meteor run
```

Open your browser to [http://localhost:3000](http://localhost:3000).

Meteor's development server provides:

- **Hot Module Replacement** — UI changes reflect instantly without a full reload.
- **Full restart** — server-side changes (publications, methods) restart the Node process automatically.

---

## 4. Project Structure

```
hybrid-hiring/
├── client/
│   └── main.tsx            # Client entry point — mounts the React app
├── server/
│   └── main.ts             # Server entry point — startup logic & data seeding
├── imports/
│   ├── api/
│   │   ├── links.ts        # Links collection (Meteor scaffold example)
│   │   └── users/
│   │       ├── collection.ts   # Mongo collection + TypeScript type
│   │       ├── methods.ts      # Meteor methods (server-side write logic)
│   │       ├── publications.ts # Meteor publications (server-side read logic)
│   │       └── index.ts        # Re-exports for cleaner imports
│   └── ui/
│       ├── App.tsx             # Root React component
│       ├── Hello.tsx           # Simple counter (Meteor scaffold example)
│       ├── Info.tsx            # Links list using useSubscribe/useFind
│       ├── UsersList.tsx       # Pub/sub reference example
│       └── UsersManager.tsx    # Methods reference example
├── tests/
│   └── main.ts             # Test entry point (Mocha)
├── .meteor/
│   ├── packages            # Atmosphere package list (like package.json for Meteor packages)
│   ├── release             # Pinned Meteor version
│   └── versions            # Locked package versions (commit this file)
├── .env                    # Local environment variables
├── .nvmrc                  # Pinned Node.js version
└── tsconfig.json           # TypeScript configuration
```

### Key conventions

| Directory      | What belongs here                                                        |
| -------------- | ------------------------------------------------------------------------ |
| `imports/api/` | Everything that touches the database: collections, methods, publications |
| `imports/ui/`  | React components — no direct database writes, use methods instead        |
| `client/`      | The single client entry point only — minimal code                        |
| `server/`      | The single server entry point only — startup & seeding                   |

Meteor only auto-loads files in `client/` and `server/`. Everything under `imports/` must be explicitly imported before it is loaded — this is intentional and keeps the dependency graph clear.

---

## 5. Core Concepts

### Publications & Subscriptions

**Where to look:** `imports/api/users/publications.ts` (server) · `imports/ui/UsersList.tsx` (client)

Publications and subscriptions are Meteor's real-time data layer. They replace the traditional fetch-on-load model with a live, automatically-synced data stream.

**How it works:**

```
Server publishes a cursor
  → Meteor streams matching documents to the client over DDP (WebSocket)
    → Client's local Minimongo cache is kept in sync
      → useFind reads from that cache reactively → component re-renders
```

**Server — define a publication** (`imports/api/users/publications.ts`):

```ts
// No arguments — stream everything
Meteor.publish('users.all', function () {
  return UsersCollection.find({}, { sort: { createdAt: -1 } });
});

// With an argument — always validate with check()
Meteor.publish('users.byName', function (nameFilter: string) {
  check(nameFilter, String);
  return UsersCollection.find({ name: { $regex: nameFilter, $options: 'i' } });
});
```

**Client — subscribe and read** (`imports/ui/UsersList.tsx`):

```tsx
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

const isLoading = useSubscribe('users.all');
const users = useFind(() => UsersCollection.find({}, { sort: { createdAt: -1 } }));

if (isLoading()) return <p>Loading…</p>;
```

**Rules to remember:**

- Return a cursor (or array of cursors) from your publication to stream data reactively.
- Always `check()` every argument that arrives from the client — the client is untrusted.
- `useSubscribe` manages the subscription lifecycle for you: it subscribes when the component mounts and unsubscribes when it unmounts.
- `useFind` and `useSubscribe` are reactive: any server-side change to the published documents triggers an automatic re-render.

---

### Methods

**Where to look:** `imports/api/users/methods.ts` (server) · `imports/ui/UsersManager.tsx` (client)

Methods are named, server-side RPC functions. Use them for any write operation or business logic that should run with full server trust.

**How it works:**

```
Client calls Meteor.callAsync('methodName', args)
  → DDP message sent to server
    → Server validates args, runs the method, writes to MongoDB
      → Subscriptions detect the change → all subscribers receive the update
        → useFind re-renders the component automatically
```

**Server — define a method** (`imports/api/users/methods.ts`):

```ts
Meteor.methods({
  'Users.create': async function (data: Omit<Users, '_id'>) {
    check(data, { name: String, createdAt: Date });
    return UsersCollection.insertAsync({ ...data });
  },

  'Users.remove': async function (_id: string) {
    check(_id, String);
    return UsersCollection.removeAsync(_id);
  },
});
```

**Client — call a method** (`imports/ui/UsersManager.tsx`):

```tsx
import { Meteor } from 'meteor/meteor';

// In Meteor 3.x, always use callAsync (never the old callback-based call).
try {
  await Meteor.callAsync('Users.create', { name, createdAt: new Date() });
} catch (err) {
  // Server throws Meteor.Error on validation or logic failures.
  if (err instanceof Meteor.Error) console.error(err.reason);
}
```

**Rules to remember:**

- In Meteor 3.x, always use `Meteor.callAsync` — it returns a Promise. The old `Meteor.call` with callbacks is deprecated.
- Always `check()` every argument. Methods run with server trust; a bad argument can corrupt data.
- Use `this.userId` inside a method to get the currently logged-in user's ID (requires a `function`, not an arrow function).
- Methods are for **writes**. For **reads**, prefer subscriptions — they stay live. `Methods` for one-off server reads are fine for non-reactive admin use cases.

---

## 6. Development Workflow

### Adding a new feature — the standard pattern

Every new data domain follows the same four-file pattern under `imports/api/<domain>/`:

| File              | Responsibility                                        |
| ----------------- | ----------------------------------------------------- |
| `collection.ts`   | Define the `Mongo.Collection` and its TypeScript type |
| `methods.ts`      | Define and register `Meteor.methods` for writes       |
| `publications.ts` | Define and register `Meteor.publish` for reads        |
| `index.ts`        | Re-export everything so consumers use one import path |

Then import the index file at the top of `server/main.ts` so Meteor loads it on startup:

```ts
import '/imports/api/your-domain';
```

### TypeScript

The project runs `strict` TypeScript. The compiler is wired into Rspack, so type errors will surface in the terminal during development. Imports for Meteor packages use the `meteor/*` path alias — for example:

```ts
import { Meteor } from 'meteor/meteor';
import { useSubscribe } from 'meteor/react-meteor-data';
```

Type declarations for Meteor packages come from `zodern:types` and `@types/meteor` — already configured in `tsconfig.json`.

### Hot Module Replacement

Client-side changes (React components, CSS) apply instantly via HMR — no manual refresh needed. Server-side changes (methods, publications) trigger an automatic server restart; the browser reconnects over DDP within a couple of seconds.

---

## 7. Git Conventions

Consistent branch names and commit messages make the history scannable and keep every change traceable back to a Jira ticket without any extra effort.

### Branch naming

```
JIRA-ID/short-description
```

- The Jira ticket ID comes first, uppercase, followed by a forward slash.
- The description is lowercase and hyphen-separated — no spaces, no special characters.
- Keep descriptions short (3–5 words is ideal).

**Examples:**

```
HH-103/create-user-profile
HH-214/fix-login-redirect
HH-87/add-users-publication
```

**Creating a branch:**

```bash
git checkout -b HH-103/create-user-profile
```

---

### Commit messages

```
[JIRA-ID] Imperative description of what this commit does
```

- Wrap the Jira ID in square brackets at the start.
- Write the description in the **imperative mood** — phrase it as a command, as if completing the sentence _"This commit will…"_
- Capitalize the first word after the bracket. No period at the end.

**Examples:**

```
[HH-103] Create user profile collection and methods
[HH-214] Fix redirect loop on failed login
[HH-87] Add users.all and users.byName publications
```

**Common mistakes to avoid:**

| Avoid                            | Use instead                                  |
| -------------------------------- | -------------------------------------------- |
| `[HH-103] Created user profile`  | `[HH-103] Create user profile`               |
| `[HH-103] creating user profile` | `[HH-103] Create user profile`               |
| `HH-103 create user profile`     | `[HH-103] Create user profile`               |
| `fixes stuff`                    | `[HH-214] Fix redirect loop on failed login` |

---

## 8. Testing

The project uses **Mocha** as its test runner, integrated via `meteortesting:mocha`.

**Run tests once** (CI-friendly):

```bash
npm test
```

**Run full-app tests in watch mode** (development):

```bash
npm run test-app
```

Test files live in `tests/main.ts` and any file matching `*.test.ts` or `*.spec.ts` within `imports/`. Tests have access to both client and server Meteor APIs via `Meteor.isClient` / `Meteor.isServer` guards.

---

## 9. Available Scripts

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm start`         | Start the Meteor dev server with HMR at `localhost:3000` |
| `npm test`          | Run the Mocha test suite once and exit                   |
| `npm run test-app`  | Run full-app tests in watch mode                         |
| `npm run visualize` | Build in production mode and open the bundle visualizer  |

---

## 10. Troubleshooting

**`meteor: command not found` after install**

Add Meteor to your PATH. The installer prints the exact line to add to your shell profile (`.zshrc`, `.bashrc`, etc.):

```bash
export PATH="$HOME/.meteor:$PATH"
```

---

**App starts but shows a blank page**

Open the browser console. A common cause is a TypeScript or JSX error that prevented the client bundle from compiling — the error will be logged there.

---

**Port 3000 is already in use**

Run on a different port:

```bash
meteor run --port 4000
```

---

**Mongo connection errors on startup**

Meteor's bundled MongoDB stores its data in `.meteor/local/db`. If that directory gets corrupted:

```bash
meteor reset
```

---

**`nvm use` says "version not found"**

Install the version from `.nvmrc` first:

```bash
nvm install
nvm use
```

---

**Changes to publications or methods are not reflected**

Publications and methods are server-side code. The dev server restarts automatically on save, but watch the terminal for compilation errors that may have prevented the restart from completing.

---

## Further Reading

- [Meteor 3 Docs](https://docs.meteor.com)
- [Meteor 3 Migration Guide](https://guide.meteor.com/3.0-migration.html)
- [react-meteor-data hooks](https://github.com/meteor/react-packages)
- [DDP Specification](https://github.com/meteor/meteor/blob/devel/packages/ddp/DDP.md) — the WebSocket protocol powering pub/sub
