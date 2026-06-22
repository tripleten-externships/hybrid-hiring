import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

function resolveFrom(): string {
  const address =
    process.env.MAIL_FROM || process.env.CONTACT_EMAIL || 'no-reply@hybridhiring.local';
  return `Hybrid Hiring <${address}>`;
}

Accounts.emailTemplates.from = resolveFrom();

Accounts.urls.resetPassword = (token: string) => {
  return Meteor.absoluteUrl(`reset-password/${token}`);
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset your Hybrid Hiring password';
  },
  text(_user, url) {
    return [
      'Hello,',
      '',
      'You requested a password reset for your Hybrid Hiring account.',
      '',
      'Click the link below to set a new password:',
      url,
      '',
      'If you did not request this, you can ignore this email.',
      '',
      'Thanks,',
      'The Hybrid Hiring Team',
    ].join('\n');
  },
};
