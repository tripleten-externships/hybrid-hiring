import { useEffect } from 'react';
import type { Job } from '/imports/api/jobs/collection';
import { CompanyLogo } from '../../components/CompanyLogo/CompanyLogo';
import { JobDescription } from '../../components/JobDescription/JobDescription';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

function formatDollar(n: number): string {
  return n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
}

function formatPay(job: Job): string {
  const unit = job.payUnit === 'salary' ? '/yr' : '/hr';
  if (job.payMax && job.payMax !== job.basePay) {
    return `${formatDollar(job.basePay)} – ${formatDollar(job.payMax)}${unit}`;
  }
  return `${formatDollar(job.basePay)}${unit}`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Read-only modal showing a job posting's full details and description. */
export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const chips = Array.from(
    new Set([job.jobType, ...(job.benefits ?? []), ...(job.tags ?? [])].filter(Boolean))
  );

  return (
    <div className="admin-modal__overlay" onMouseDown={onClose} role="presentation">
      <div
        className="admin-modal job-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="job-modal__header">
          <div className="job-modal__header-main">
            {job.companyLogo && (
              <CompanyLogo src={job.companyLogo} company={job.company} size="md" />
            )}
            <div>
              <h2 id="job-modal-title" className="admin-modal__title">
                {job.title}
              </h2>
              <p className="job-modal__subtitle">
                {job.company} · {job.location}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="job-modal__close"
            onClick={onClose}
            aria-label="Close job details"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <line
                x1="3.5"
                y1="3.5"
                x2="12.5"
                y2="12.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <line
                x1="12.5"
                y1="3.5"
                x2="3.5"
                y2="12.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="job-modal__meta">
          <span className="job-modal__meta-item">
            <span className="job-modal__meta-label">Pay</span>
            {formatPay(job)}
          </span>
          <span className="job-modal__meta-item">
            <span className="job-modal__meta-label">Type</span>
            {job.jobType}
          </span>
          <span className="job-modal__meta-item">
            <span className="job-modal__meta-label">Posted</span>
            {formatDate(job.postedAt)}
          </span>
          <span className="job-modal__meta-item">
            <span className="job-modal__meta-label">Status</span>
            <span
              className={`admin__status ${job.isActive ? 'admin__status--active' : 'admin__status--inactive'}`}
            >
              {job.isActive ? 'Active' : 'Inactive'}
            </span>
          </span>
        </div>

        {chips.length > 0 && (
          <div className="job-modal__chips">
            {chips.map((chip, i) => (
              <span key={`${chip}-${i}`} className="admin-users__chip">
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className="job-modal__section">
          <h3 className="job-modal__section-title">Description</h3>
          <JobDescription description={job.description} className="job-modal__description" />
        </div>
      </div>
    </div>
  );
}
