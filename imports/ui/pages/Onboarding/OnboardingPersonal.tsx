import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { SelectionLabel } from '../../components';
import { useMyProfile } from '../../hooks/useCurrentUser';
import type { JobType } from '/imports/types/jobs';
import './Onboarding.css';

const JOB_TYPE_OPTIONS = [
  { label: 'Full-time', value: 'full-time' as JobType },
  { label: 'Part-time', value: 'part-time' as JobType },
  { label: 'Contract', value: 'contract' as JobType },
] as const;

export const OnboardingPersonal = () => {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useMyProfile();
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [remote, setRemote] = useState(false);
  const [pay, setPay] = useState('');
  const [payPeriod, setPayPeriod] = useState<'hour' | 'year'>('hour');
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [openAnyJob, setOpenAnyJob] = useState(false);
  const hydratedRef = useRef(false);

  // Pre-populate from the saved profile so editing never wipes existing data.
  useEffect(() => {
    if (hydratedRef.current || profileLoading) return;
    hydratedRef.current = true;
    if (!profile) return;

    setCity([profile.city, profile.state].filter(Boolean).join(', '));
    setZip(profile.zip ?? '');
    setPhone(profile.phone ?? '');
    setRemote(!!profile.remoteOk);
    setPay(profile.minPay != null ? String(profile.minPay) : '');
    setPayPeriod(profile.payUnit === 'yearly' ? 'year' : 'hour');
    setSelectedJobTypes(profile.jobTypes ?? []);
    setJobTitles(
      profile.preferredTitle
        ? profile.preferredTitle
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    );
    setOpenAnyJob(profile.activelyLooking === false);
  }, [profile, profileLoading]);

  const toggleJobType = (value: JobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleAddJobTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && jobTitleInput.trim()) {
      e.preventDefault();
      if (jobTitles.length >= 10) return;
      if (jobTitles.includes(jobTitleInput.trim())) return;
      setJobTitles([...jobTitles, jobTitleInput.trim()]);
      setJobTitleInput('');
    }
  };

  const handleRemoveJobTitle = (title: string) => {
    setJobTitles((prev) => prev.filter((t) => t !== title));
  };

  const handleContinue = async () => {
    try {
      setError('');
      setIsSaving(true);

      const cityParts = city.trim().split(',');
      const cityName = cityParts[0]?.trim() || city.trim();
      const stateName = cityParts[1]?.trim() || '';
      const minPay = pay ? parseFloat(pay) : undefined;
      const payUnit: 'hourly' | 'yearly' = payPeriod === 'hour' ? 'hourly' : 'yearly';

      // Commit any title still in the input (user may not have pressed Enter).
      const pendingTitle = jobTitleInput.trim();
      const titlesToSave =
        pendingTitle && !jobTitles.includes(pendingTitle)
          ? [...jobTitles, pendingTitle]
          : jobTitles;
      if (pendingTitle && !jobTitles.includes(pendingTitle)) {
        setJobTitles(titlesToSave);
        setJobTitleInput('');
      }

      await Meteor.callAsync('UserProfiles.upsert', {
        city: cityName,
        state: stateName,
        zip: zip.trim() || undefined,
        phone: phone.trim() || undefined,
        remoteOk: remote,
        ...(minPay !== undefined && { minPay, payUnit }),
        jobTypes: selectedJobTypes,
        preferredTitle: titlesToSave.length > 0 ? titlesToSave.join(', ') : '',
        activelyLooking: !openAnyJob,
      });

      navigate('/onboarding/professional');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save your preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ob-page">
      <div className="ob-step">
        {/* Progress */}
        <div className="ob-progress">
          <h1 className="ob-progress__title">Profile Builder</h1>
          <p className="ob-progress__label">Step 1 of 3</p>
          <div className="ob-progress__dots">
            <span className="ob-progress__dot ob-progress__dot--active" />
            <span className="ob-progress__dot" />
            <span className="ob-progress__dot" />
          </div>
        </div>

        {/* Location */}
        <div className="ob-card">
          <div className="ob-card__description">
            <h2 className="ob-card__heading">Where are you located?</h2>
            <p className="ob-card__subheading">We use this to match you with nearby jobs.</p>
          </div>

          <div className="ob-fields">
            <div className="ob-input">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div className="ob-input">
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Zip Code"
              />
            </div>
            <div className="ob-input">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                autoComplete="tel"
              />
            </div>
            <div className="ob-toggle-row">
              <span className="ob-toggle-row__label">I'm interested in remote work</span>
              <button
                type="button"
                role="switch"
                aria-checked={remote}
                className={`ob-toggle${remote ? ' ob-toggle--on' : ''}`}
                onClick={() => setRemote(!remote)}
              />
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="ob-card">
          <div className="ob-card__description">
            <h2 className="ob-card__heading">What's the minimum pay you're looking for?</h2>
            <p className="ob-card__subheading">
              We match you with jobs that pay at or above this amount.
            </p>
          </div>

          <div className="ob-fields">
            <div className="ob-input">
              <span className="ob-input__prefix">$</span>
              <input
                type="number"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                placeholder="Minimum base pay"
              />
            </div>

            <div className="ob-pay-row">
              <p className="ob-pay-row__label">Pay period:</p>
              <SelectionLabel
                label="Per Hour"
                selected={payPeriod === 'hour'}
                onClick={() => setPayPeriod('hour')}
              />
              <SelectionLabel
                label="Per Year"
                selected={payPeriod === 'year'}
                onClick={() => setPayPeriod('year')}
              />
            </div>
          </div>
        </div>

        {/* Job type */}
        <div className="ob-card">
          <div className="ob-card__description">
            <h2 className="ob-card__heading">What type of job are you interested in?</h2>
            <p className="ob-card__subheading">Select all that apply.</p>
          </div>

          <div className="ob-chips">
            {JOB_TYPE_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                className={`ob-chip${selectedJobTypes.includes(value) ? ' ob-chip--selected' : ''}`}
                onClick={() => toggleJobType(value)}
                aria-pressed={selectedJobTypes.includes(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred titles */}
        <div className="ob-card">
          <div className="ob-card__description">
            <h2 className="ob-card__heading">What job are you looking for?</h2>
            <p className="ob-card__subheading">
              Press Enter to add a title. This helps us surface the most relevant listings.
            </p>
          </div>

          <div className="ob-fields">
            <div className="ob-input">
              <input
                type="text"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                onKeyDown={handleAddJobTitle}
                placeholder="e.g. Pipeline Technician, Electrician…"
              />
            </div>

            {jobTitles.length > 0 && (
              <ul className="ob-tags">
                {jobTitles.map((title) => (
                  <li key={title} className="ob-tag">
                    {title}
                    <button
                      type="button"
                      className="ob-tag__remove"
                      onClick={() => handleRemoveJobTitle(title)}
                      aria-label={`Remove ${title}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="ob-toggle-row">
              <span className="ob-toggle-row__label">I'm open to any job position</span>
              <button
                type="button"
                role="switch"
                aria-checked={openAnyJob}
                className={`ob-toggle${openAnyJob ? ' ob-toggle--on' : ''}`}
                onClick={() => setOpenAnyJob(!openAnyJob)}
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
