import React, { useState } from 'react';

import { Button } from '../../components/Button/Button';
import './Onboarding.css';

export const OnboardingSkills = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');

  const addSkill = () => {
    const trimmedInput = skillInput.trim();
    if (!trimmedInput) return;
    setSkills((prevSkills) => [...prevSkills, trimmedInput]);
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = () => {
    // Handle form submission, e.g., send skills to backend or move to next page
    console.log('Submitted skills:', skills);
  };

  return (
    <div className="onboarding__skills">
      <div className="onboarding__header">
        <img src="/assets/back.svg" alt="Backbutton" className="onboarding__back-btn" />
        <p className="onboarding__skip-text">Skip</p>
        <img src="/assets/skip.svg" alt="" className="onboarding__skip-btn" />
      </div>
      <div className="onboarding__logo-wrapper">
        <img
          src="/assets/company-logo.svg"
          alt="Company Logo"
          className="onboarding__company-logo"
        />
      </div>
      <p className="onboarding__skills-page-display">Page 3 of 3</p>
      <div className="onboarding__skills-content">
        <h3 className="onboarding__skills-title">Add your skills.</h3>
        <p className="onboarding__skills-subtitle">
          This is optional, but your answers help us make better job recommendations.
        </p>
        <div className="onboarding__skills-input-wrapper">
          <input
            id="skills"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add skills"
            className="onboarding__skills-input"
          />
        </div>
        <ul className="onboarding__skills-skills-chips">
          {skills.map((skill, index) => (
            <li key={index} className="onboarding__skills-skill-chip">
              <img
                src="/assets/chip-close.svg"
                alt=""
                className="onboarding__skills-skill-close-btn"
                onClick={() => removeSkill(index)}
              />
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <div className="onboarding__skills-footer">
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
