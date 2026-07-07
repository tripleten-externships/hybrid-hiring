import { useState, useRef, type FormEvent, type ReactNode } from 'react';
import { Meteor } from 'meteor/meteor';
import type { JobType } from '/imports/types';
import { getDescriptionText } from '/imports/api/jobs/description';
import { RichTextEditor } from '../../components/RichTextEditor/RichTextEditor';
import { fileToLogoDataUrl } from '../../utils/image';

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
  companyLogo: string;
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
  companyLogo: '',
};

/** Splits a comma-separated input into a trimmed, non-empty string array. */
function splitList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function AdminJobForm({ leftSlot }: { leftSlot?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoError, setLogoError] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.company.trim() || !form.location.trim()) {
      setError('Title, company, and location are required.');
      return;
    }
    if (!getDescriptionText(form.description)) {
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
        description: form.description,
        ...(form.companyLogo ? { companyLogo: form.companyLogo } : {}),
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

  const handleLogoSelect = async (file: File | undefined) => {
    if (!file) return;
    setLogoError('');
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      setForm((prev) => ({ ...prev, companyLogo: dataUrl }));
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : 'Could not process the logo image.');
    }
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({ ...prev, companyLogo: '' }));
    setLogoError('');
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  return (
    <section className="admin-form">
      <div className="admin-form__bar">
        {leftSlot && <div className="admin-form__bar-start">{leftSlot}</div>}
        <button
          type="button"
          className="admin-form__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? 'Cancel' : '+ Add Job Posting'}
        </button>
      </div>
      {success && (
        <span className="admin-form__success" role="status">
          {success}
        </span>
      )}

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
              <span className="admin-form__label">Company logo (optional)</span>
              <div className="admin-form__logo">
                {form.companyLogo ? (
                  <div className="admin-form__logo-preview">
                    <img src={form.companyLogo} alt="" className="admin-form__logo-image" />
                    <button
                      type="button"
                      className="admin-form__logo-remove"
                      onClick={handleRemoveLogo}
                    >
                      Remove logo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="admin-form__logo-upload"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    Upload company logo
                  </button>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="admin-form__logo-input"
                  onChange={(e) => {
                    void handleLogoSelect(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </div>
              {logoError && (
                <p className="admin-form__error admin-form__error--inline" role="alert">
                  {logoError}
                </p>
              )}
            </label>

            <label className="admin-form__field admin-form__field--full">
              <span className="admin-form__label">Description *</span>
              <RichTextEditor
                id="job-description"
                value={form.description}
                onChange={(html) => update('description', html)}
                placeholder="Describe the role, responsibilities, and requirements."
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
