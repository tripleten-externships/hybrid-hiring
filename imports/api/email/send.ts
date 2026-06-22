import { Email } from 'meteor/email';

export interface Attachment {
  filename: string;
  content: string;
  contentType?: string;
  encoding?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  attachments?: Attachment[];
}

/**
 * Resolves the configured "from" address. Falls back to CONTACT_EMAIL when a
 * dedicated MAIL_FROM is not set.
 */
function resolveFrom(): string {
  return process.env.MAIL_FROM || process.env.CONTACT_EMAIL || 'no-reply@hybridhiring.local';
}

/**
 * Returns the configured Hybrid Hiring contact (recipient) address, or null
 * when it has not been configured.
 */
export function getContactEmail(): string | null {
  return process.env.CONTACT_EMAIL || null;
}

/**
 * Thin wrapper around Meteor's Email.sendAsync. In development without a
 * MAIL_URL configured, Meteor prints the message to the server console, so the
 * full flow is testable without SMTP credentials.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, text, attachments } = options;

  if (!to) {
    console.warn('[email] Skipping send: no recipient configured (set CONTACT_EMAIL).');
    return;
  }

  if (!process.env.MAIL_URL) {
    console.log(
      `[email] MAIL_URL not set — Meteor will log this message to the console.${
        attachments && attachments.length > 0
          ? ` (includes ${attachments.length} attachment(s))`
          : ''
      }`
    );
  }

  await Email.sendAsync({
    from: resolveFrom(),
    to,
    subject,
    text,
    attachments,
  });
}
