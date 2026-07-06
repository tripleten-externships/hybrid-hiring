import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { AdminCollection, requireAdminAsync } from './collection';
import { ProfilesCollection, type UserProfile } from '../profiles/collection';
import { ResumesCollection } from '../resumes/collection';
import { ApplicationsCollection } from '../applications/collection';
import { NotificationsCollection } from '../notifications/collection';
import { JobsCollection, type Job } from '../jobs/collection';

const SEARCH_LIMIT = 8;

/** Lightweight user summary returned by the autocomplete search. */
export interface AdminUserSummary {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  locked: boolean;
}

/** Resume metadata (never includes the file bytes). */
export interface AdminResumeMeta {
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
}

/** Full detail payload for a selected user. */
export interface AdminUserDetails extends AdminUserSummary {
  createdAt: Date | null;
  profile: UserProfile | null;
  resume: AdminResumeMeta | null;
  applications: {
    jobId: string;
    jobTitle: string;
    company: string;
    status: string;
    createdAt: Date;
  }[];
}

/** Escapes a user-supplied string for safe use inside a RegExp. */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayName(user: Meteor.User | null | undefined): string {
  const profile = user?.profile as { name?: string } | undefined;
  return profile?.name || user?.emails?.[0]?.address || 'Unknown user';
}

async function adminUserIds(userIds: string[]): Promise<Set<string>> {
  const records = await AdminCollection.find(
    { userId: { $in: userIds } },
    { fields: { userId: 1 } }
  ).fetchAsync();
  return new Set(records.map((r) => r.userId));
}

Meteor.methods({
  /** Admin-only: search users by email or name for the lookup autocomplete. */
  async 'admin.searchUsers'(rawQuery: string): Promise<AdminUserSummary[]> {
    await requireAdminAsync(this.userId ?? undefined);
    check(rawQuery, String);

    const query = rawQuery.trim();
    if (query.length < 2) return [];

    const re = new RegExp(escapeRegExp(query), 'i');
    const users = await Meteor.users
      .find(
        {
          $or: [
            { 'emails.address': re },
            { 'profile.name': re },
            { 'profile.firstName': re },
            { 'profile.lastName': re },
          ],
        },
        {
          limit: SEARCH_LIMIT,
          fields: { emails: 1, profile: 1, locked: 1 },
        }
      )
      .fetchAsync();

    const adminIds = await adminUserIds(users.map((u) => u._id));

    return users.map((u) => ({
      userId: u._id,
      name: displayName(u),
      email: u.emails?.[0]?.address ?? '',
      isAdmin: adminIds.has(u._id),
      locked: !!(u as { locked?: boolean }).locked,
    }));
  },

  /** Admin-only: full detail for a selected user (excludes resume bytes). */
  async 'admin.getUserDetails'(userId: string): Promise<AdminUserDetails> {
    await requireAdminAsync(this.userId ?? undefined);
    check(userId, String);

    const user = await Meteor.users.findOneAsync(userId, {
      fields: { emails: 1, profile: 1, locked: 1, createdAt: 1 },
    });
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found.');
    }

    const profile = (await ProfilesCollection.findOneAsync({ userId })) ?? null;

    const resumeDoc = await ResumesCollection.findOneAsync({ userId }, { fields: { data: 0 } });

    const applications = await ApplicationsCollection.find(
      { userId },
      {
        sort: { createdAt: -1 },
        fields: { jobId: 1, jobTitle: 1, company: 1, status: 1, createdAt: 1 },
      }
    ).fetchAsync();

    const isAdminUser = !!(await AdminCollection.findOneAsync({ userId }));

    return {
      userId,
      name: displayName(user),
      email: user.emails?.[0]?.address ?? '',
      isAdmin: isAdminUser,
      locked: !!(user as { locked?: boolean }).locked,
      createdAt: (user as { createdAt?: Date }).createdAt ?? null,
      profile,
      resume: resumeDoc
        ? {
            fileName: resumeDoc.fileName,
            contentType: resumeDoc.contentType,
            size: resumeDoc.size,
            uploadedAt: resumeDoc.uploadedAt,
          }
        : null,
      applications: applications.map((a) => ({
        jobId: a.jobId,
        jobTitle: a.jobTitle,
        company: a.company,
        status: a.status,
        createdAt: a.createdAt,
      })),
    };
  },

  /** Admin-only: fetch a single job posting (used by the user-applications view). */
  async 'admin.getJob'(jobId: string): Promise<Job> {
    await requireAdminAsync(this.userId ?? undefined);
    check(jobId, String);

    const job = await JobsCollection.findOneAsync(jobId);
    if (!job) {
      throw new Meteor.Error('not-found', 'Job not found.');
    }
    return job;
  },

  /** Admin-only: fetch a user's resume file bytes for viewing/downloading. */
  async 'admin.getUserResume'(
    userId: string
  ): Promise<{ fileName: string; contentType: string; data: string }> {
    await requireAdminAsync(this.userId ?? undefined);
    check(userId, String);

    const resume = await ResumesCollection.findOneAsync({ userId });
    if (!resume) {
      throw new Meteor.Error('not-found', 'This user has no resume on file.');
    }

    return {
      fileName: resume.fileName,
      contentType: resume.contentType,
      data: resume.data,
    };
  },

  /** Admin-only: lock or unlock an account. Locking also ends active sessions. */
  async 'admin.setUserLocked'(userId: string, locked: boolean): Promise<void> {
    await requireAdminAsync(this.userId ?? undefined);
    check(userId, String);
    check(locked, Boolean);

    if (userId === this.userId) {
      throw new Meteor.Error('invalid-target', 'You cannot lock your own account.');
    }

    const modifier: Record<string, unknown> = { $set: { locked } };
    // Invalidate existing login tokens so a locked user is signed out immediately.
    if (locked) {
      modifier.$set = { locked: true };
      (modifier as { $unset?: Record<string, ''> }).$unset = { 'services.resume.loginTokens': '' };
    }

    await Meteor.users.updateAsync(userId, modifier);
  },

  /** Admin-only: grant or revoke admin privileges for a user. */
  async 'admin.setUserAdmin'(userId: string, makeAdmin: boolean): Promise<void> {
    await requireAdminAsync(this.userId ?? undefined);
    check(userId, String);
    check(makeAdmin, Boolean);

    if (userId === this.userId) {
      throw new Meteor.Error('invalid-target', 'You cannot change your own admin status.');
    }

    const existing = await AdminCollection.findOneAsync({ userId });

    if (makeAdmin) {
      if (existing) return;
      const user = await Meteor.users.findOneAsync(userId, { fields: { emails: 1, profile: 1 } });
      if (!user) {
        throw new Meteor.Error('not-found', 'User not found.');
      }
      await AdminCollection.insertAsync({
        userId,
        name: displayName(user),
        createdAt: new Date(),
      });
    } else if (existing?._id) {
      await AdminCollection.removeAsync(existing._id);
    }
  },

  /** Admin-only: permanently delete a user and all associated records. */
  async 'admin.deleteUser'(userId: string): Promise<void> {
    await requireAdminAsync(this.userId ?? undefined);
    check(userId, String);

    if (userId === this.userId) {
      throw new Meteor.Error('invalid-target', 'You cannot delete your own account.');
    }

    const user = await Meteor.users.findOneAsync(userId, { fields: { _id: 1 } });
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found.');
    }

    await Promise.all([
      ProfilesCollection.removeAsync({ userId }),
      ResumesCollection.removeAsync({ userId }),
      ApplicationsCollection.removeAsync({ userId }),
      NotificationsCollection.removeAsync({ userId }),
      AdminCollection.removeAsync({ userId }),
    ]);

    await Meteor.users.removeAsync(userId);
  },
});
