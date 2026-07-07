import { useEffect, useState, type FormEvent } from 'react';
import { Meteor } from 'meteor/meteor';
import type { Job } from '/imports/api/jobs/collection';
import { CompanyLogo } from '../../components/CompanyLogo/CompanyLogo';
import { JobDescription } from '../../components/JobDescription/JobDescription';
import { AdminJobFormFields } from './AdminJobFormFields';
import { jobToFormState, parseJobForm, type JobFormState } from './adminJobFormShared';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onUpdated?: (job: Job) => void;
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

/** Modal for viewing and editing a job posting. */
export function JobDetailsModal({ job, onClose, onUpdated }: JobDetailsModalProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [displayJob, setDisplayJob] = useState(job);
  const [form, setForm] = useState<JobFormState>(() => jobToFormState(job));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState('');

  useEffect(() => {
    setDisplayJob(job);
    setForm(jobToFormState(job));
    setMode('view');
    setError('');
    setLogoError('');
  }, [job]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const update = (field: keyof JobFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleEdit = () => {
    setForm(jobToFormState(displayJob));
    setError('');
    setLogoError('');
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setForm(jobToFormState(displayJob));
    setError('');
    setLogoError('');
    setMode('view');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayJob._id) return;

    const parsed = parseJobForm(form);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }

    const { data } = parsed;

    try {
      setSubmitting(true);
      setError('');

      const updates: Record<string, unknown> = {
        title: data.title,
        company: data.company,
        location: data.location,
        jobType: data.jobType,
        payUnit: data.payUnit,
        basePay: data.basePay,
        tags: data.tags,
        benefits: data.benefits,
        description: data.description,
      };

      if (data.clearPayMax) {
        updates.payMax = null;
      } else if (data.payMax !== undefined) {
        updates.payMax = data.payMax;
      }

      if (data.clearCompanyLogo) {
        updates.companyLogo = '';
      } else if (data.companyLogo) {
        updates.companyLogo = data.companyLogo;
      }

      await Meteor.callAsync('jobs.update', displayJob._id, updates);

      const updatedJob: Job = {
        ...displayJob,
        title: data.title,
        company: data.company,
        location: data.location,
        jobType: data.jobType,
        payUnit: data.payUnit,
        basePay: data.basePay,
        tags: data.tags,
        benefits: data.benefits,
        description: data.description,
      };

      if (data.clearPayMax) {
        delete updatedJob.payMax;
      } else if (data.payMax !== undefined) {
        updatedJob.payMax = data.payMax;
      }

      if (data.clearCompanyLogo) {
        delete updatedJob.companyLogo;
      } else if (data.companyLogo) {
        updatedJob.companyLogo = data.companyLogo;
      }

      setDisplayJob(updatedJob);
      onUpdated?.(updatedJob);
      setMode('view');
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setError(reason || 'Failed to save changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const chips = Array.from(
    new Set(
      [displayJob.jobType, ...(displayJob.benefits ?? []), ...(displayJob.tags ?? [])].filter(
        Boolean
      )
    )
  );

  return (
    <div className="admin-modal__overlay" onMouseDown={onClose} role="presentation">
      <div
        className={`admin-modal job-modal${mode === 'edit' ? ' job-modal--edit' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="job-modal__header">
          <div className="job-modal__header-main">
            {mode === 'view' && displayJob.companyLogo && (
              <CompanyLogo src={displayJob.companyLogo} company={displayJob.company} size="md" />
            )}
            <div>
              <h2 id="job-modal-title" className="admin-modal__title">
                {mode === 'edit' ? 'Edit job posting' : displayJob.title}
              </h2>
              {mode === 'view' && (
                <p className="job-modal__subtitle">
                  {displayJob.company} · {displayJob.location}
                </p>
              )}
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

        {mode === 'view' ? (
          <>
            <div className="job-modal__meta">
              <span className="job-modal__meta-item">
                <span className="job-modal__meta-label">Pay</span>
                {formatPay(displayJob)}
              </span>
              <span className="job-modal__meta-item">
                <span className="job-modal__meta-label">Type</span>
                {displayJob.jobType}
              </span>
              <span className="job-modal__meta-item">
                <span className="job-modal__meta-label">Posted</span>
                {formatDate(displayJob.postedAt)}
              </span>
              <span className="job-modal__meta-item">
                <span className="job-modal__meta-label">Status</span>
                <span
                  className={`admin__status ${displayJob.isActive ? 'admin__status--active' : 'admin__status--inactive'}`}
                >
                  {displayJob.isActive ? 'Active' : 'Inactive'}
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
              <JobDescription
                description={displayJob.description}
                className="job-modal__description"
              />
            </div>

            <div className="job-modal__footer">
              <button type="button" className="admin-form__submit" onClick={handleEdit}>
                Edit posting
              </button>
            </div>
          </>
        ) : (
          <form className="job-modal__form" onSubmit={handleSave}>
            <AdminJobFormFields
              form={form}
              onChange={update}
              descriptionId="job-edit-description"
              logoError={logoError}
              onLogoError={setLogoError}
            />

            {error && (
              <p className="admin-form__error" role="alert">
                {error}
              </p>
            )}

            <div className="job-modal__footer">
              <button
                type="button"
                className="admin-modal__btn admin-modal__btn--cancel"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="admin-form__submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
