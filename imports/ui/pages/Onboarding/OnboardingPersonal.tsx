import React, { useState } from 'react';
import './OnboardingPersonal.css';
import { Button, SelectionLabel } from '../../components';
import { useNavigate } from 'react-router-dom';

export const OnboardingPersonal = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [remote, setRemote] = useState(false);

  const [pay, setPay] = useState('');
  const [payPeriod, setPayPeriod] = useState<'hour' | 'year'>('hour');

  const [fullTime, setFullTime] = useState(false);
  const [partTime, setPartTime] = useState(false);
  const [contractTime, setContractTime] = useState(false);
  const [temporaryTime, setTemporaryTime] = useState(false);
  const [internshipTime, setInternshipTime] = useState(false);

  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobTitles, setJobTitles] = useState<string[]>([]);

  const [openAnyJob, setOpenAnyJob] = useState(false);

  const handleAddJobTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && jobTitleInput.trim()) {
      e.preventDefault();

      if (jobTitles.length >= 10) return;
      if (jobTitles.includes(jobTitleInput.trim())) return;

      setJobTitles([...jobTitles, jobTitleInput.trim()]);
      setJobTitleInput('');
    }
  };

  const handleRemoveJobTitle = (index: number) => {
    setJobTitles(jobTitles.filter((_, i) => i !== index));
  };

  return (
    <div className="onboarding-personal">
      {/* // section 1 */}
      <div className="onboarding-personal__header">
        <div className="onboarding-personal__nav">
          <div className="btn-back">
            <button type="button" className="onboarding-personal__btn btn-back">
              <img src="/assets/skip.svg" alt="Back" />
            </button>
          </div>

          <div className="onboarding-personal__logo">
            <img src="/assets/company-logo.svg" alt="Logo" />
          </div>

          <button type="button" className="onboarding-personal__btn btn-skip" onClick={() => navigate('/jobs')}>
            Skip <img src="/assets/skip.svg" alt="Skip" />
          </button>
        </div>

        <h1 className="onboarding-personal__title top-title">Profile Builder</h1>
        <p className="onboarding-personal__subtitle">Page 1 of 3</p>
      </div>

      <div className="onboarding-personal__main-contents">
        {/* locations */}
        <div className="onboarding-personal__location onboarding-personal__main-content">
          <div className="onboarding-personal__description">
            <h2 className="onboarding-personal__title">
              Let’s make sure your preferences are up-to-date. Where are you located?
            </h2>
            <p className="onboarding-personal__subtitle">
              We use this to match you with nearby jobs.
            </p>
          </div>

          <div className="onboarding-personal__inputs">
            <div className="onboarding-personal__input">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, State"
              />
            </div>

            <div className="onboarding-personal__input">
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Zip Code"
              />
            </div>

            <div className="onboarding-personal__input-toggle">
              <span className="onboarding-personal__subtitle">I’m interested in remote work</span>

              <div
                className={`toggle ${remote ? 'toggle--on' : ''}`}
                onClick={() => setRemote(!remote)}
              />
            </div>
          </div>
        </div>

        {/* salary */}
        <div className="onboarding-personal__location onboarding-personal__main-content">
          <div className="onboarding-personal__description">
            <h2 className="onboarding-personal__title">
              What’s the minimum pay you’re looking for?
            </h2>

            <p className="onboarding-personal__subtitle">
              We use this to match you with jobs that pay around and above this amount.
            </p>
          </div>

          <div className="onboarding-personal__inputs pay-period">
            <div className="onboarding-personal__input">
              <input
                type="number"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                placeholder="Minimum base pay $"
              />
            </div>

            <div className="onboarding-personal__input-pay">
              <p className="onboarding-personal__subtitle">Pay period:</p>

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

        {/* it was so difficult to style selectionlabel becasue it does not support variant or prop, i struggled with it with the above two.
         so i decided not to use it */}
        <div className="onboarding-personal__location onboarding-personal__main-content">
          <div className="onboarding-personal__description">
            <h2 className="onboarding-personal__title">What type of job are you interested in?</h2>

            <p className="onboarding-personal__subtitle">Select all that apply.</p>
          </div>

          <div className="onboarding-personal__inputs job-type">
            <button
              type="button"
              className={`chip ${fullTime ? 'chip--selected' : ''}`}
              onClick={() => setFullTime(!fullTime)}
            >
              <img src="/assets/plus.svg" alt="" />
              Full-time
            </button>

            <button
              type="button"
              className={`chip ${partTime ? 'chip--selected' : ''}`}
              onClick={() => setPartTime(!partTime)}
            >
              <img src="/assets/plus.svg" alt="" />
              Part-time
            </button>

            <button
              type="button"
              className={`chip ${contractTime ? 'chip--selected' : ''}`}
              onClick={() => setContractTime(!contractTime)}
            >
              <img src="/assets/plus.svg" alt="" />
              Contract
            </button>

            <button
              type="button"
              className={`chip ${temporaryTime ? 'chip--selected' : ''}`}
              onClick={() => setTemporaryTime(!temporaryTime)}
            >
              <img src="/assets/plus.svg" alt="" />
              Temporary
            </button>

            <button
              type="button"
              className={`chip ${internshipTime ? 'chip--selected' : ''}`}
              onClick={() => setInternshipTime(!internshipTime)}
            >
              <img src="/assets/plus.svg" alt="" />
              Internship
            </button>
          </div>
        </div>

        {/* job side */}
        <div className="onboarding-personal__location onboarding-personal__main-content">
          <div className="onboarding-personal__description">
            <h2 className="onboarding-personal__title">What job are you looking for?</h2>

            <p className="onboarding-personal__subtitle">
              This helps us show you the most relevant jobs.
            </p>
          </div>

          <div className="onboarding-personal__inputs pay-period">
            <div className="onboarding-personal__input">
              <input
                type="text"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                onKeyDown={handleAddJobTitle}
                placeholder="Job title: Add up to 10 job titles"
              />
            </div>

            {/* user creates their own tags */}
            {jobTitles.length > 0 && (
              <div className="job-tags__list onboarding-personal__subtitle">
                {jobTitles.map((title, index) => (
                  <span key={index} className="job-tag">
                    {title}
                    <button
                      type="button"
                      className="job-tags__list-delete"
                      onClick={() => handleRemoveJobTitle(index)}
                    >
                      X
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="onboarding-personal__input-toggle">
              <span className="onboarding-personal__subtitle">I’m open to any job position</span>

              <div
                className={`toggle ${openAnyJob ? 'toggle--on' : ''}`}
                onClick={() => setOpenAnyJob(!openAnyJob)}
              />
            </div>
          </div>
        </div>

        <div className="onboarding-personal__btn">
          <Button variant="primary" type="button">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
