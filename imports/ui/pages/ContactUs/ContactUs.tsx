import { ContactInfoPanel } from "../../components/ContactInfoPanel/ContactInfoPanel";
import "./ContactUs.css";

export const ContactUs = () => {
  return (
    <main className="contact-us">
      <div className="contact-us__left">
        <ContactInfoPanel />
      </div>

      <div className="contact-us__right">
        {/* Empty for HH-97 */}
      </div>
    </main>
  );
};