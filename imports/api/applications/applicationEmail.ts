import type { Attachment } from '../email/send';
import { HH_LOGO_PNG_BASE64 } from '../email/logo';

/** Content-ID that ties the inline logo attachment to the <img> in the header. */
export const LOGO_CID = 'hh-logo';

export interface ApplicationEmailData {
  job: {
    title: string;
    company: string;
    location: string;
    jobType: string;
    pay: string;
    jobId: string;
    /** Absolute URL to the job posting on the site. */
    url: string;
  };
  applicant: {
    name: string;
    email: string;
    phone: string;
    location: string;
    skills: string;
    resumeFileName: string | null;
    needsResumeHelp: boolean;
  };
  /** Submission timestamp; defaults to now. */
  submittedAt?: Date;
}

/** Escapes text for safe interpolation into HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const BRAND = '#3c784c';
const BRAND_DARK = '#2f5f3d';
const INK = '#1d1d1f';
const MUTED = '#6b6b70';
const BORDER = '#e5e7eb';
const CANVAS = '#f4f5f7';

/** Renders a single label/value row for the HTML detail tables. */
function htmlRow(label: string, value: string, opts: { last?: boolean } = {}): string {
  const border = opts.last ? '' : `border-bottom:1px solid ${BORDER};`;
  return `
    <tr>
      <td style="padding:10px 0;${border}font-size:13px;color:${MUTED};width:150px;vertical-align:top;">${esc(
        label
      )}</td>
      <td style="padding:10px 0;${border}font-size:14px;color:${INK};font-weight:500;vertical-align:top;">${value}</td>
    </tr>`;
}

/** Builds the multipart (HTML + plain-text) admin notification for a new application. */
export function buildApplicationEmail(data: ApplicationEmailData): {
  text: string;
  html: string;
  attachments: Attachment[];
} {
  const { job, applicant } = data;
  const submittedAt = data.submittedAt ?? new Date();
  const dateStr = submittedAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const resumeText = applicant.resumeFileName
    ? `Attached — ${applicant.resumeFileName}`
    : 'No resume on file';
  const resumeHtml = applicant.resumeFileName
    ? `<span style="display:inline-block;background:#eef6f0;color:${BRAND_DARK};font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;">📎 Attached</span> <span style="color:${MUTED};font-size:13px;">${esc(
        applicant.resumeFileName
      )}</span>`
    : `<span style="color:${MUTED};">No resume on file</span>`;

  const resumeHelpHtml = applicant.needsResumeHelp
    ? `<span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;">Requested</span>`
    : `<span style="color:${MUTED};">No</span>`;

  const mailtoSubject = encodeURIComponent(`Your application: ${job.title}`);
  const emailCell = applicant.email
    ? `<a href="mailto:${esc(applicant.email)}?subject=${mailtoSubject}" style="color:${BRAND_DARK};text-decoration:none;">${esc(
        applicant.email
      )}</a>`
    : '&mdash;';

  // ── Plain-text fallback ───────────────────────────────────────────────────
  const text = [
    'A new job application has been submitted.',
    `Submitted: ${dateStr}`,
    '',
    '=== JOB ===',
    `Title:    ${job.title}`,
    `Company:  ${job.company}`,
    `Location: ${job.location}`,
    `Type:     ${job.jobType}`,
    `Pay:      ${job.pay}`,
    `Job ID:   ${job.jobId}`,
    `View:     ${job.url}`,
    '',
    '=== APPLICANT ===',
    `Name:              ${applicant.name}`,
    `Email:             ${applicant.email || '—'}`,
    `Phone:             ${applicant.phone}`,
    `Location:          ${applicant.location || '—'}`,
    `Skills:            ${applicant.skills}`,
    `Resume:            ${resumeText}`,
    `Needs resume help: ${applicant.needsResumeHelp ? 'Yes' : 'No'}`,
  ].join('\n');

  // ── HTML version ──────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <title>New Job Application</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;font-size:1px;color:${CANVAS};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">New application from ${esc(
    applicant.name
  )} for ${esc(job.title)}.</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND};padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;text-align:left;">
                    <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.8);font-weight:600;">Hybrid Hiring Solutions</p>
                    <h1 style="margin:4px 0 0;font-size:20px;line-height:1.3;color:#ffffff;font-weight:700;">New Job Application</h1>
                  </td>
                  <td width="52" style="vertical-align:middle;text-align:right;padding-left:14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" align="right">
                      <tr>
                        <td style="background:#ffffff;border-radius:12px;padding:6px;line-height:0;">
                          <img src="cid:${LOGO_CID}" width="40" height="40" alt="Hybrid Hiring Solutions"
                               style="display:block;width:40px;height:40px;border:0;border-radius:8px;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Intro -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0;font-size:15px;line-height:1.5;color:${INK};">
                <strong>${esc(applicant.name)}</strong> applied for
                <strong>${esc(job.title)}</strong> at ${esc(job.company)}.
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:${MUTED};">Submitted ${esc(dateStr)}</p>
            </td>
          </tr>
          <!-- Job card -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};border:1px solid ${BORDER};border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};font-weight:600;">Position</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:${INK};">${esc(
                      job.title
                    )}</p>
                    <p style="margin:2px 0 0;font-size:13px;color:${MUTED};">${esc(
                      job.company
                    )} &bull; ${esc(job.location)}</p>
                    <p style="margin:10px 0 0;font-size:13px;color:${INK};">
                      <span style="display:inline-block;background:#ffffff;border:1px solid ${BORDER};border-radius:999px;padding:3px 12px;margin-right:6px;">${esc(
                        job.jobType
                      )}</span>
                      <span style="display:inline-block;background:#ffffff;border:1px solid ${BORDER};border-radius:999px;padding:3px 12px;">${esc(
                        job.pay
                      )}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Applicant details -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};font-weight:600;">Applicant</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${htmlRow('Name', esc(applicant.name))}
                ${htmlRow('Email', emailCell)}
                ${htmlRow('Phone', esc(applicant.phone))}
                ${htmlRow('Location', esc(applicant.location || '—'))}
                ${htmlRow('Skills', esc(applicant.skills))}
                ${htmlRow('Resume', resumeHtml)}
                ${htmlRow('Needs resume help', resumeHelpHtml, { last: true })}
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:16px 32px 28px;">
              <a href="${esc(job.url)}"
                 style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:999px;margin:0 8px 8px 0;">
                View job posting
              </a>
              ${
                applicant.email
                  ? `<a href="mailto:${esc(applicant.email)}?subject=${mailtoSubject}"
                 style="display:inline-block;background:#ffffff;border:1px solid ${BORDER};color:${INK};text-decoration:none;font-size:14px;font-weight:600;padding:10px 21px;border-radius:999px;margin:0 8px 8px 0;">
                Reply to ${esc(applicant.name)}
              </a>`
                  : ''
              }
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;background:${CANVAS};border-top:1px solid ${BORDER};">
              <p style="margin:0;font-size:12px;line-height:1.5;color:${MUTED};">
                This notification was sent automatically by Hybrid Hiring Solutions.
                Job ID: ${esc(job.jobId)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const attachments: Attachment[] = [
    {
      filename: 'logo.png',
      content: HH_LOGO_PNG_BASE64,
      contentType: 'image/png',
      encoding: 'base64',
      cid: LOGO_CID,
    },
  ];

  return { text, html, attachments };
}
