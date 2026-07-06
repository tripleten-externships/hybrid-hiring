import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { TextInput } from '../../components/TextInput/TextInput';
import { useMyProfile } from '../../hooks/useCurrentUser';
import './Onboarding.css';

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 12l4-4-4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 13V4M10 4L7 7M10 4l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Reads a File into a base64 string (without the data URL prefix). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const OnboardingProfessional = () => {
  const { profile, isLoading: profileLoading } = useMyProfile();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [existingResumeName, setExistingResumeName] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [needsResumeHelp, setNeedsResumeHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const hydratedRef = useRef(false);

  const navigate = useNavigate();

  // Pre-populate from the saved profile so editing never wipes existing data.
  useEffect(() => {
    if (hydratedRef.current || profileLoading) return;
    hydratedRef.current = true;
    if (!profile) return;
    setCertUrl(profile.certUrl ?? '');
    setNeedsResumeHelp(!!profile.needsResumeHelp);
    setExistingResumeName(profile.resumeUrl ?? '');
  }, [profile, profileLoading]);

  const handleContinue = async () => {
    if (!resumeFile && !certUrl && !existingResumeName && !needsResumeHelp) {
      setError(
        'Please upload a document, add a credential title, or indicate if you need help building your resume before continuing.'
      );
      return;
    }

    try {
      setError('');
      setIsSaving(true);

      if (resumeFile) {
        const base64 = await fileToBase64(resumeFile);
        await Meteor.callAsync(
          'resumes.upload',
          resumeFile.name,
          resumeFile.type || 'application/octet-stream',
          base64
        );
      }

      await Meteor.callAsync('UserProfiles.upsert', {
        certUrl,
        needsResumeHelp,
      });
      navigate('/onboarding/skills');
    } catch (err) {
      console.error('Failed to save profile:', err);
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setError(reason || 'Failed to save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name);
      setError('');
    }
  };

  return (
    <div className="ob-page">
      <div className="ob-step">
        {/* Nav */}
        <div className="ob-nav">
          <button
            type="button"
            className="ob-nav__back"
            onClick={() => navigate('/onboarding/personal')}
          >
            <ChevronIcon />
            Back
          </button>
        </div>

        {/* Progress */}
        <div className="ob-progress">
          <h1 className="ob-progress__title">Profile Builder</h1>
          <p className="ob-progress__label">Step 2 of 3</p>
          <div className="ob-progress__dots">
            <span className="ob-progress__dot ob-progress__dot--done" />
            <span className="ob-progress__dot ob-progress__dot--active" />
            <span className="ob-progress__dot" />
          </div>
        </div>

        {/* Credentials card */}
        <div className="ob-card">
          <div className="ob-card__description">
            <h2 className="ob-card__heading">Upload your credentials</h2>
            <p className="ob-card__subheading">
              Resume, certificates, licences – you'll only need to do this once.
            </p>
          </div>

          <div className="ob-fields">
            <TextInput
              label="Credential title"
              id="certUrl"
              name="certUrl"
              value={certUrl}
              placeholder="e.g. OSHA 10, AWS Certified Welder"
              onChange={(e) => {
                setCertUrl(e.target.value);
                setError('');
              }}
            />

            <div className="ob-upload">
              <input
                id="resumeUpload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                hidden
              />
              <label htmlFor="resumeUpload" className="ob-upload__trigger">
                <UploadIcon />
                {resumeFileName || existingResumeName ? 'Replace document' : 'Upload document'}
              </label>

              {resumeFileName ? (
                <p className="ob-upload__filename">{resumeFileName}</p>
              ) : (
                existingResumeName && (
                  <p className="ob-upload__filename">{existingResumeName} (on file)</p>
                )
              )}
            </div>

            <div className="ob-toggle-row">
              <span className="ob-toggle-row__label">I need help building my resume</span>
              <button
                type="button"
                role="switch"
                aria-checked={needsResumeHelp}
                className={`ob-toggle${needsResumeHelp ? ' ob-toggle--on' : ''}`}
                onClick={() => setNeedsResumeHelp((prev) => !prev)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ob-footer">
          {error && (
            <p className="ob-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            className="ob-btn-continue"
            onClick={handleContinue}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
