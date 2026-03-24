import { ContactInfoPanel } from '../../components/ContactInfoPanel/ContactInfoPanel';
import './ContactUs.css';

export const ContactUs = () => {
  const phoneNumber = '+1 (555) 000-0000';
  const emailAddress = 'contact@hybridhiring.com';

  return (
    <main className="contact-us">
      <div className="contact-us__left">
        <ContactInfoPanel phone={phoneNumber} email={emailAddress} />
      </div>

      <div className="contact-us__right">{/* Empty for HH-97 */}</div>
    </main>
  );
};
