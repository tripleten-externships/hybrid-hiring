import { useState, type FormEvent, type ReactNode } from 'react';
import { Meteor } from 'meteor/meteor';
import { AdminJobFormFields } from './AdminJobFormFields';
import { EMPTY_JOB_FORM, parseJobForm, type JobFormState } from './adminJobFormShared';

export function AdminJobForm({ leftSlot }: { leftSlot?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<JobFormState>(EMPTY_JOB_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoError, setLogoError] = useState('');

  const update = (field: keyof JobFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setForm(EMPTY_JOB_FORM);
    setError('');
    setLogoError('');
    setOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const parsed = parseJobForm(form);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }

    const { data } = parsed;

    try {
      setSubmitting(true);
      await Meteor.callAsync('jobs.create', {
        title: data.title,
        company: data.company,
        location: data.location,
        jobType: data.jobType,
        payUnit: data.payUnit,
        basePay: data.basePay,
        ...(data.payMax !== undefined ? { payMax: data.payMax } : {}),
        tags: data.tags,
        benefits: data.benefits,
        description: data.description,
        ...(data.companyLogo ? { companyLogo: data.companyLogo } : {}),
        externalApplyUrl: '',
      });
      setForm(EMPTY_JOB_FORM);
      setSuccess('Job posting added.');
      setOpen(false);
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setError(reason || 'Failed to add job posting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-form">
      {!open && (
        <div className="admin-form__bar">
          {leftSlot && <div className="admin-form__bar-start">{leftSlot}</div>}
          <button
            type="button"
            className="admin-form__toggle"
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            + New Job Posting
          </button>
        </div>
      )}
      {success && (
        <span className="admin-form__success" role="status">
          {success}
        </span>
      )}

      {open && (
        <form className="admin-form__panel" onSubmit={handleSubmit}>
          <AdminJobFormFields
            form={form}
            onChange={update}
            logoError={logoError}
            onLogoError={setLogoError}
          />

          {error && (
            <p className="admin-form__error" role="alert">
              {error}
            </p>
          )}

          <div className="admin-form__actions">
            <button
              type="button"
              className="admin-modal__btn admin-modal__btn--cancel"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="admin-form__submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
