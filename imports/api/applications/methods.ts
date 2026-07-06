import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ApplicationsCollection } from './collection';
import { JobsCollection } from '../jobs/collection';
import { ProfilesCollection } from '../profiles/collection';
import { ResumesCollection } from '../resumes/collection';
import { NotificationsCollection } from '../notifications/collection';
import { sendEmail, getContactEmail, type Attachment } from '../email/send';
import { buildApplicationEmail } from './applicationEmail';

function formatPay(basePay: number, payMax: number | undefined, payUnit: string): string {
  const unit = payUnit === 'salary' ? '/yr' : '/hr';
  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
  if (payMax && payMax !== basePay) {
    return `${fmt(basePay)} - ${fmt(payMax)}${unit}`;
  }
  return `${fmt(basePay)}${unit}`;
}

Meteor.methods({
  async 'applications.submit'(jobId: string) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Please sign in to apply.');
    }

    check(jobId, String);

    const userId = this.userId;

    const job = await JobsCollection.findOneAsync({ _id: jobId });
    if (!job) {
      throw new Meteor.Error('not-found', 'This job is no longer available.');
    }

    // Prevent duplicate applications to the same job.
    const existing = await ApplicationsCollection.findOneAsync({ userId, jobId });
    if (existing) {
      throw new Meteor.Error('already-applied', 'You have already applied to this job.');
    }

    const user = await Meteor.users.findOneAsync(userId);
    const profile = await ProfilesCollection.findOneAsync({ userId });
    const resume = await ResumesCollection.findOneAsync({ userId });

    const userProfile = user?.profile as
      | { name?: string; firstName?: string; lastName?: string }
      | undefined;
    const applicantEmail = user?.emails?.[0]?.address ?? '';
    const applicantName =
      profile?.name ||
      userProfile?.name ||
      [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ') ||
      user?.username ||
      applicantEmail ||
      'Applicant';

    await ApplicationsCollection.insertAsync({
      jobId,
      userId,
      applicantName,
      applicantEmail,
      jobTitle: job.title,
      company: job.company,
      status: 'submitted',
      createdAt: new Date(),
    });

    // ── Email the Hybrid Hiring contact inbox ──────────────────────────────
    const contactEmail = getContactEmail();

    const locationLine = [profile?.city, profile?.state].filter(Boolean).join(', ');
    const skillsLine = profile?.skills?.length ? profile.skills.join(', ') : '—';
    const phoneLine = profile?.phone?.trim() || '—';

    const {
      text: body,
      html,
      attachments: emailAttachments,
    } = buildApplicationEmail({
      job: {
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        pay: formatPay(job.basePay, job.payMax, job.payUnit),
        jobId,
        url: Meteor.absoluteUrl(`jobs/${jobId}`),
      },
      applicant: {
        name: applicantName,
        email: applicantEmail,
        phone: phoneLine,
        location: locationLine,
        skills: skillsLine,
        resumeFileName: resume ? resume.fileName : null,
        needsResumeHelp: !!profile?.needsResumeHelp,
      },
    });

    const attachments: Attachment[] = [...emailAttachments];
    if (resume) {
      attachments.push({
        filename: resume.fileName,
        content: resume.data,
        contentType: resume.contentType,
        encoding: 'base64',
      });
    }

    try {
      await sendEmail({
        to: contactEmail ?? '',
        subject: `${applicantName} applied for ${job.title} at ${job.company}`,
        text: body,
        html,
        attachments,
      });
    } catch (err) {
      // Don't fail the application if email delivery has an issue; log for ops.
      console.error('[applications.submit] Failed to send contact email:', err);
    }

    // ── Notify the applicant (persisted, shown in the NotificationBell) ─────
    await NotificationsCollection.insertAsync({
      userId,
      type: 'application_submitted',
      title: 'Application submitted',
      body: `Your application to "${job.title}" has been successfully submitted. The Hybrid Hiring Team will be in contact after your application has been reviewed.`,
      jobId,
      read: false,
      createdAt: new Date(),
    });

    return { jobTitle: job.title };
  },
});
