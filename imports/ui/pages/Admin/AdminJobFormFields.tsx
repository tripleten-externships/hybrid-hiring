import { useRef } from 'react';
import { RichTextEditor } from '../../components/RichTextEditor/RichTextEditor';
import { fileToLogoDataUrl } from '../../utils/image';
import type { JobFormState } from './adminJobFormShared';

type AdminJobFormFieldsProps = {
  form: JobFormState;
  onChange: (field: keyof JobFormState, value: string) => void;
  descriptionId?: string;
  logoError?: string;
  onLogoError?: (message: string) => void;
};

export function AdminJobFormFields({
  form,
  onChange,
  descriptionId = 'job-description',
  logoError,
  onLogoError,
}: AdminJobFormFieldsProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoSelect = async (file: File | undefined) => {
    if (!file) return;
    onLogoError?.('');
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      onChange('companyLogo', dataUrl);
    } catch (err) {
      onLogoError?.(err instanceof Error ? err.message : 'Could not process the logo image.');
    }
  };

  return (
    <div className="admin-form__grid">
      <label className="admin-form__field">
        <span className="admin-form__label">Job title *</span>
        <input
          className="admin-form__input"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. Warehouse Associate"
        />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Company *</span>
        <input
          className="admin-form__input"
          value={form.company}
          onChange={(e) => onChange('company', e.target.value)}
          placeholder="e.g. Acme Logistics"
        />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Location *</span>
        <input
          className="admin-form__input"
          value={form.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="e.g. Austin, TX"
        />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Job type</span>
        <select
          className="admin-form__input"
          value={form.jobType}
          onChange={(e) => onChange('jobType', e.target.value)}
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
          onChange={(e) => onChange('payUnit', e.target.value)}
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
          onChange={(e) => onChange('basePay', e.target.value)}
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
          onChange={(e) => onChange('payMax', e.target.value)}
          placeholder="Leave blank if fixed"
        />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Tags (comma-separated)</span>
        <input
          className="admin-form__input"
          value={form.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          placeholder="e.g. Forklift, Night shift"
        />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Benefits (comma-separated)</span>
        <input
          className="admin-form__input"
          value={form.benefits}
          onChange={(e) => onChange('benefits', e.target.value)}
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
                onClick={() => {
                  onChange('companyLogo', '');
                  if (logoInputRef.current) logoInputRef.current.value = '';
                }}
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
          id={descriptionId}
          value={form.description}
          onChange={(html) => onChange('description', html)}
          placeholder="Describe the role, responsibilities, and requirements."
        />
      </label>
    </div>
  );
}
