import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import type { JobType } from '/imports/types/jobs';

interface FormState {
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  payUnit: 'hourly' | 'salary';
  basePay: string;
  payMax: string;
  tags: string;
  benefits: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  company: '',
  location: '',
  jobType: 'full-time',
  payUnit: 'hourly',
  basePay: '',
  payMax: '',
  tags: '',
  benefits: '',
  description: '',
};

/** Splits a comma-separated input into a trimmed, non-empty string array. */
function splitList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function AdminJobForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.company.trim() || !form.location.trim()) {
      setError('Title, company, and location are required.');
      return;
    }
    if (!form.description.trim()) {
      setError('Please add a job description.');
      return;
    }
    const basePay = parseFloat(form.basePay);
    if (isNaN(basePay) || basePay < 0) {
      setError('Please enter a valid base pay amount.');
      return;
    }
    const payMax = form.payMax.trim() ? parseFloat(form.payMax) : undefined;
    if (payMax !== undefined && (isNaN(payMax) || payMax < basePay)) {
      setError('Maximum pay must be a number greater than or equal to base pay.');
      return;
    }

    try {
      setSubmitting(true);
      await Meteor.callAsync('jobs.create', {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        jobType: form.jobType,
        payUnit: form.payUnit,
        basePay,
        ...(payMax !== undefined ? { payMax } : {}),
        tags: splitList(form.tags),
        benefits: splitList(form.benefits),
        description: form.description.trim(),
        externalApplyUrl: '',
      });
      setForm(EMPTY_FORM);
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
      <div className="admin-form__bar">
        <button
          type="button"
          className="admin-form__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? 'Cancel' : '+ Add Job Posting'}
        </button>
        {success && (
          <span className="admin-form__success" role="status">
            {success}
          </span>
        )}
      </div>

      {open && (
        <form className="admin-form__panel" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <label className="admin-form__field">
              <span className="admin-form__label">Job title *</span>
              <input
                className="admin-form__input"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Warehouse Associate"
              />
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">Company *</span>
              <input
                className="admin-form__input"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="e.g. Acme Logistics"
              />
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">Location *</span>
              <input
                className="admin-form__input"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Austin, TX"
              />
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">Job type</span>
              <select
                className="admin-form__input"
                value={form.jobType}
                onChange={(e) => update('jobType', e.target.value)}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">Pay type</span>
              <select
                className="admin-form__input"
                value={form.payUnit}
                onChange={(e) => update('payUnit', e.target.value)}
              >
                <option value="hourly">Hourly</option>
                <option value="salary">Salary</option>
              </select>
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">
                Base pay * ({form.payUnit === 'salary' ? 'per year' : 'per hour'})
              </span>
              <input
                className="admin-form__input"
                type="number"
                min="0"
                value={form.basePay}
                onChange={(e) => update('basePay', e.target.value)}
                placeholder={form.payUnit === 'salary' ? 'e.g. 65000' : 'e.g. 22'}
              />
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">Maximum pay (optional)</span>
              <input
                className="admin-form__input"
                type="number"
                min="0"
                value={form.payMax}
                onChange={(e) => update('payMax', e.target.value)}
                placeholder="Leave blank if fixed"
              />
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">Tags (comma-separated)</span>
              <input
                className="admin-form__input"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="e.g. Forklift, Night shift"
              />
            </label>

            <label className="admin-form__field">
              <span className="admin-form__label">Benefits (comma-separated)</span>
              <input
                className="admin-form__input"
                value={form.benefits}
                onChange={(e) => update('benefits', e.target.value)}
                placeholder="e.g. Health insurance, 401k"
              />
            </label>

            <label className="admin-form__field admin-form__field--full">
              <span className="admin-form__label">Description *</span>
              <textarea
                className="admin-form__input admin-form__textarea"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and requirements."
                rows={5}
              />
            </label>
          </div>

          {error && (
            <p className="admin-form__error" role="alert">
              {error}
            </p>
          )}

          <div className="admin-form__actions">
            <button type="submit" className="admin-form__submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Job Posting'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
