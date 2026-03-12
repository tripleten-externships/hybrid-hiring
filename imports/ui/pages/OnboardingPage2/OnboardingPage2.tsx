import { useState } from 'react';
import { TextInput } from '../../components/TextInput/TextInput';
import './OnboardingPage2.css';

export const OnboardingPage2 = () => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [activelyLooking, setActivelyLooking] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // UI-only storage
      setResumeUrl(file.name);
    }
  };

  return (
    <div className="onboarding-page2">
      <button className="onboarding-page2__back-button">
        <img src="/icons/material-symbols_arrow-back.svg" alt="Back" />
      </button>

      <div className="onboarding-page2__progress">Page 2 of 3</div>

      <div className="onboarding-page2__card">
        <h2 className="onboarding-page2__title">
          Upload your credentials (resume, certificates, etc.)
        </h2>

        <p className="onboarding-page2__subtitle">
          Don't worry, you'll only have to upload these once.
        </p>

        <div className="onboarding-page2__input-wrapper">
          <TextInput
            label=""
            id="certUrl"
            name="certUrl"
            value={certUrl}
            placeholder="Insert title"
            onChange={(e) => setCertUrl(e.target.value)}
          />
        </div>

        <div className="onboarding-page2__upload">
          <input
            id="resumeUpload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            hidden
          />

          <label htmlFor="resumeUpload" className="onboarding-page2__upload-button">
            <img src="/icons/material-symbols_upload.svg" alt="upload" />
            Upload Document
          </label>

          {resumeUrl && <p className="onboarding-page2__file-name">{resumeUrl}</p>}

          <button className="onboarding-page2__add-document">+ Add another document</button>
        </div>

        <div className="onboarding-page2__toggle-section">
          <span>I need help building my resume</span>

          <label className="onboarding-page2__toggle">
            <input
              type="checkbox"
              checked={activelyLooking}
              onChange={() => setActivelyLooking(!activelyLooking)}
            />
            <span className="onboarding-page2__toggle-slider"></span>
          </label>
        </div>
      </div>

      <button className="onboarding-page2__continue-button">Continue</button>
    </div>
  );
};
