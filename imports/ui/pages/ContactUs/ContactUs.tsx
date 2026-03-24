import { useState } from "react";
import { TextInput } from "../../components/TextInput/TextInput";
import { TextArea } from "../../components/TextArea/TextArea";
import { Button } from "../../components/Button/Button";
import "./ContactUs.css";

export const ContactUs = () => {
  // ✅ Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  // ✅ Handle change (works for input + textarea)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="contact-us">
      {/* LEFT PANEL (placeholder for HH-97) */}
      <div className="contact-us__left" />

      {/* RIGHT PANEL */}
      <div className="contact-us__right">
        <div className="contact-us__form-container">
          <h2 className="contact-us__title">Send Us a Message</h2>

          <form className="contact-us__form">
            {/* Row 1 */}
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

            {/* Row 2 */}
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

            {/* Message */}
            <TextArea
              label="Message"
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
            />

            {/* Submit */}
            <Button type="submit">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};