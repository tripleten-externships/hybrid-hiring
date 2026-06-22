import { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useAppSettings } from '/imports/ui/hooks/useCurrentUser';

interface SettingsFormState {
  showSocials: boolean;
  facebook: string;
  linkedin: string;
  instagram: string;
  phone: string;
  email: string;
  quote: string;
  authorName: string;
  authorTitle: string;
}

export function AdminSettingsForm() {
  const settings = useAppSettings();

  const [form, setForm] = useState<SettingsFormState>({
    showSocials: true,
    facebook: '',
    linkedin: '',
    instagram: '',
    phone: '',
    email: '',
    quote: '',
    authorName: '',
    authorTitle: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hydrate the form from live settings as they load / change.
  useEffect(() => {
    setForm({
      showSocials: settings.showSocials,
      facebook: settings.socialLinks.facebook,
      linkedin: settings.socialLinks.linkedin,
      instagram: settings.socialLinks.instagram,
      phone: settings.contact.phone,
      email: settings.contact.email,
      quote: settings.testimonial.quote,
      authorName: settings.testimonial.authorName,
      authorTitle: settings.testimonial.authorTitle,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.showSocials,
    settings.socialLinks.facebook,
    settings.socialLinks.linkedin,
    settings.socialLinks.instagram,
    settings.contact.phone,
    settings.contact.email,
    settings.testimonial.quote,
    settings.testimonial.authorName,
    settings.testimonial.authorTitle,
  ]);

  // Auto-dismiss the success banner after 5 seconds.
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(''), 5000);
    return () => clearTimeout(timer);
  }, [success]);

  const update = <K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.phone.trim() || !form.email.trim()) {
      setError('Contact phone and email are required.');
      return;
    }
    if (!form.quote.trim() || !form.authorName.trim()) {
      setError('Testimonial quote and author name are required.');
      return;
    }

    try {
      setSaving(true);
      await Meteor.callAsync('settings.update', {
        showSocials: form.showSocials,
        socialLinks: {
          facebook: form.facebook.trim(),
          linkedin: form.linkedin.trim(),
          instagram: form.instagram.trim(),
        },
        contact: {
          phone: form.phone.trim(),
          email: form.email.trim(),
        },
        testimonial: {
          quote: form.quote.trim(),
          authorName: form.authorName.trim(),
          authorTitle: form.authorTitle.trim(),
        },
      });
      setSuccess('Site settings saved.');
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setError(reason || 'Failed to save site settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-form">
      {success && (
        <span className="admin-form__success" role="status">
          {success}
        </span>
      )}

      <form className="admin-form__panel" onSubmit={handleSave}>
        <h3 className="admin-settings__section-title">Social links</h3>

        <div className="admin-settings__toggle">
          <span className="admin-settings__toggle-label">Show social buttons</span>
          <button
            type="button"
            role="switch"
            aria-checked={form.showSocials}
            className={`admin-switch ${form.showSocials ? 'admin-switch--on' : ''}`}
            onClick={() => update('showSocials', !form.showSocials)}
          >
            <span className="admin-switch__thumb" />
          </button>
          <span className="admin-settings__toggle-state">
            {form.showSocials ? 'Visible' : 'Hidden'}
          </span>
        </div>

        <p className="admin-settings__hint">
          When the toggle is off, all social buttons are hidden. When it's on, only buttons with a
          link below are shown – if a button is not linked to anything, it will not be shown.
        </p>

        <div className="admin-form__grid">
          <label className="admin-form__field">
            <span className="admin-form__label">Facebook URL</span>
            <input
              className="admin-form__input"
              value={form.facebook}
              onChange={(e) => update('facebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </label>

          <label className="admin-form__field">
            <span className="admin-form__label">LinkedIn URL</span>
            <input
              className="admin-form__input"
              value={form.linkedin}
              onChange={(e) => update('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </label>

          <label className="admin-form__field">
            <span className="admin-form__label">Instagram URL</span>
            <input
              className="admin-form__input"
              value={form.instagram}
              onChange={(e) => update('instagram', e.target.value)}
              placeholder="https://instagram.com/yourhandle"
            />
          </label>
        </div>

        <h3 className="admin-settings__section-title">Contact information</h3>
        <div className="admin-form__grid">
          <label className="admin-form__field">
            <span className="admin-form__label">Phone *</span>
            <input
              className="admin-form__input"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </label>

          <label className="admin-form__field">
            <span className="admin-form__label">Email *</span>
            <input
              className="admin-form__input"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="contact@example.com"
            />
          </label>
        </div>

        <h3 className="admin-settings__section-title">Homepage testimonial</h3>
        <div className="admin-form__grid">
          <label className="admin-form__field admin-form__field--full">
            <span className="admin-form__label">Quote *</span>
            <textarea
              className="admin-form__input admin-form__textarea"
              value={form.quote}
              onChange={(e) => update('quote', e.target.value)}
              placeholder="What the person said about Hybrid Hiring Solutions."
              rows={3}
            />
          </label>

          <label className="admin-form__field">
            <span className="admin-form__label">Author name *</span>
            <input
              className="admin-form__input"
              value={form.authorName}
              onChange={(e) => update('authorName', e.target.value)}
              placeholder="e.g. John Smith"
            />
          </label>

          <label className="admin-form__field">
            <span className="admin-form__label">Author title</span>
            <input
              className="admin-form__input"
              value={form.authorTitle}
              onChange={(e) => update('authorTitle', e.target.value)}
              placeholder="e.g. Gas plant operator"
            />
          </label>
        </div>

        {error && (
          <p className="admin-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="admin-form__actions">
          <button type="submit" className="admin-form__submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </section>
  );
}
