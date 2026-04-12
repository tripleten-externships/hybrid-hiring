import { useState } from 'react';
import { TextInput } from '../../components/TextInput/TextInput';
import { TextArea } from '../../components/TextArea/TextArea';
import { Button } from '../../components/Button/Button';
import { ContactInfoPanel } from '../../components/ContactInfoPanel/ContactInfoPanel';
import { Meteor } from 'meteor/meteor';
import './ContactUs.css';

export const ContactUs = () => {
  const phoneNumber = '+1 (555) 000-0000';
  const emailAddress = 'contact@hybridhiring.com';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setSuccess(false);
    setError('');

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.email || !form.message) {
      setError('First name, email, and message are required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await Meteor.callAsync('contacts.submit', form);

      setSuccess(true);

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.reason || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="contact-us">
      {/* LEFT PANEL (placeholder for HH-97) */}
      <div className="contact-us__left">
        <ContactInfoPanel phone={phoneNumber} email={emailAddress} />
      </div>

      <div className="contact-us__right">
        <div className="contact-us__form-container">
          {success && (
            <div className="contact-us__success">Your message has been sent successfully!</div>
          )}

          {error && <div className="contact-us__error">{error}</div>}
          <form className="contact-us__form" onSubmit={handleSubmit} noValidate>
            <div className="contact-us__row">
              <TextInput
                label="First name"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
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
                label="Email"
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />

              <TextInput
                label="Phone number"
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
              />
            </div>

            <TextArea
              label="Message"
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Your message..."
            />

            <Button type="submit" className="contact-us__submit" loading={isLoading}>
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};
