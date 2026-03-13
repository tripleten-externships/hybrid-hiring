import React, { useState } from 'react';
import { TextInput } from '../../components/TextInput/TextInput';
import { Button } from '../../components/Button/Button';
import './OnboardingPage3.css';

export const OnboardingPage3 = () => {
  const [skills, setSkills] = useState('');

  const handleSubmit = () => {};

  return (
    <div className="onboarding__page-3">
      <div className="onboarding__header">
        <img src="/assets/back.svg" alt="Backbutton" className="onboarding__back-btn" />
      </div>
      <p className="onboarding__page-display">Page 3 of 3</p>
      <div className="onboarding__content">
        <h3 className="onboarding__skills-title">Add your skills.</h3>
        <p className="onboarding__skills-subtitle">
          This is optional, but your answers help us make better job recommendations
        </p>
        <div className="onboarding__input-wrapper">
          <TextInput
            label=""
            id="skills"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Add skills"
          />
        </div>
        <ul className="onboarding__skills-chips">
          <li className="onboarding__skill-chip">
            <img src="/assets/chip-close.svg" alt="" className="onboarding__skill-close-btn" />
            JavaScript
          </li>
          <li className="onboarding__skill-chip">
            <img src="/assets/chip-close.svg" alt="" className="onboarding__skill-close-btn" />
            React
          </li>
        </ul>
      </div>
      <div className="onboarding__footer">
        <Button
          variant="primary"
          size="md"
          loading={false}
          disabled={false}
          fullWidth={false}
          type="submit"
          onClick={handleSubmit}
        >
          Finish
        </Button>
      </div>
    </div>
  );
};
