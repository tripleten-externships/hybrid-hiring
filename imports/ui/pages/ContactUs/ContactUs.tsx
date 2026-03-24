import { useState } from 'react';
import { TextInput } from '../../components/TextInput/TextInput';
import { TextArea } from '../../components/TextArea/TextArea';
import { Button } from '../../components/Button/Button';
import { ContactInfoPanel } from '../../components/ContactInfoPanel/ContactInfoPanel';
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="contact-us">
      {/* LEFT PANEL (placeholder for HH-97) */}
      <div className="contact-us__left"><ContactInfoPanel phone={phoneNumber} email={emailAddress} /></div>

      <div className="contact-us__right">
        <div className="contact-us__form-container">
          <form className="contact-us__form">
            <div className="contact-us__row">
              <TextInput
                label="First name"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />

              <TextInput
                label="Last name"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
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
              />

              <TextInput
                label="Phone number"
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <TextArea
              label="Message"
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
            />

            <Button type="submit" className="contact-us__submit">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};
