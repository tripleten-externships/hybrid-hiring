import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { TextInput } from '../../components/TextInput/TextInput';
import './Onboarding.css';

export const OnboardingProfessional = () => {
  const [resumeFileName, setResumeFileName] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [needsResumeHelp, setNeedsResumeHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const handleContinue = async () => {
    if (!resumeFileName && !certUrl) {
      alert('Please upload a document or add a credential title.');
      return;
    }

    try {
      setIsSaving(true);

      await Meteor.callAsync('UserProfiles.upsert', {
        resumeUrl: resumeFileName,
        certUrl,
        needsResumeHelp,
      });

      navigate('/onboarding/skills');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // TODO [HH-69]: replace with actual file upload once backend supports it
      setResumeFileName(file.name);
    }
  };

  return (
    <div className="onboarding-main">
      <button
        type="button"
        className="onboarding-main__back-button"
        onClick={() => navigate('/onboarding/personal')}
      >
        <img src="/assets/material-symbols_arrow-back.svg" alt="Back" />
      </button>

      <div className="onboarding-main__progress">Page 2 of 3</div>

      <div className="onboarding-main__card">
        <h2 className="onboarding-main__title">
          Upload your credentials (resume, certificates, etc.)
        </h2>

        <p className="onboarding-main__subtitle">
          Don't worry, you'll only have to upload these once.
        </p>

        <div className="onboarding-main__input-wrapper">
          <TextInput
            label="Credential title"
            id="certUrl"
            name="certUrl"
            value={certUrl}
            placeholder="Insert title"
            onChange={(e) => setCertUrl(e.target.value)}
          />
        </div>

        <div className="onboarding-main__upload">
          <input
            id="resumeUpload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            hidden
          />

          <label htmlFor="resumeUpload" className="onboarding-main__upload-button">
            <img src="/assets/material-symbols_upload.svg" alt="" />
            Upload Document
          </label>

          {resumeFileName && <p className="onboarding-main__file-name">{resumeFileName}</p>}

          <button type="button" className="onboarding-main__add-document">
            + Add another document
          </button>
        </div>

        <div className="onboarding-main__toggle-section">
          <span id="resume-help-label">I need help building my resume</span>

          <label className="onboarding-main__toggle">
            <input
              type="checkbox"
              checked={needsResumeHelp}
              aria-labelledby="resume-help-label"
              onChange={() => setNeedsResumeHelp((prev) => !prev)}
            />
            <span className="onboarding-main__toggle-slider"></span>
          </label>
        </div>
      </div>

      <button
        type="button"
        className="onboarding-main__continue-button"
        onClick={handleContinue}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
};
