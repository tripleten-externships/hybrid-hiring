import { useState } from 'react';
import { TextInput } from '../../components/TextInput/TextInput';
import { TextArea } from '../../components/TextArea/TextArea';
import { ContactInfoPanel } from '../../components/ContactInfoPanel/ContactInfoPanel';
import { useAppSettings } from '../../hooks/useCurrentUser';
import { Meteor } from 'meteor/meteor';
import './ContactUs.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s().+\-]{7,20}$/;

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormFields, string>>;

function validate(form: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (form.phone.trim() && !PHONE_RE.test(form.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required.';
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

export const ContactUs = () => {
  const settings = useAppSettings();
  const phoneNumber = settings.contact.phone;
  const emailAddress = settings.contact.email;

  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState<FormFields>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSuccess(false);
    setServerError(null);
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    setSuccess(false);

    try {
      await Meteor.callAsync('contacts.submit', form);
      setSuccess(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (err: unknown) {
      if (err instanceof Meteor.Error) {
        setServerError(err.reason || err.message || 'Something went wrong.');
      } else if (err instanceof Error) {
        setServerError(err.message || 'Something went wrong.');
      } else {
        setServerError('Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="contact-us">
      <div className="contact-us__left">
        <ContactInfoPanel phone={phoneNumber} email={emailAddress} />
      </div>

      <div className="contact-us__right">
        <div className="contact-us__form-container">
          {success && (
            <div className="contact-us__success">Your message has been sent successfully!</div>
          )}

          {serverError && (
            <div className="contact-us__error" role="alert">
              {serverError}
            </div>
          )}

          <form className="contact-us__form" onSubmit={handleSubmit} noValidate>
            <div className="contact-us__row">
              <TextInput
                label="First name *"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                error={fieldErrors.firstName}
              />
              <TextInput
                label="Last name"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>

            <div className="contact-us__row">
              <TextInput
                label="Email *"
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                error={fieldErrors.email}
              />
              <TextInput
                label="Phone number"
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                error={fieldErrors.phone}
              />
            </div>

            <TextArea
              label="Message *"
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Your message..."
              error={fieldErrors.message}
            />

            <button type="submit" className="contact-us__submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
