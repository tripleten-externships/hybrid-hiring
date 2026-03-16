import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button } from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage3.css';

export const OnboardingPage3 = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');
  const navigate = useNavigate();

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

  const handleFinish = async () => {
    try {
      await Meteor.callAsync('Profiles.upsert', { skills });
      navigate('/jobs'); // Redirect to jobs page after finishing onboarding
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="onboarding__page-3">
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
      <p className="onboarding__page-display">Page 3 of 3</p>
      <div className="onboarding__content">
        <h3 className="onboarding__skills-title">Add your skills.</h3>
        <p className="onboarding__skills-subtitle">
          This is optional, but your answers help us make better job recommendations.
        </p>
        <div className="onboarding__input-wrapper">
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
        <ul className="onboarding__skills-chips">
          {skills.map((skill, index) => (
            <li key={index} className="onboarding__skill-chip">
              <img
                src="/assets/chip-close.svg"
                alt=""
                className="onboarding__skill-close-btn"
                onClick={() => removeSkill(index)}
              />
              {skill}
            </li>
          ))}
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
          onClick={handleFinish}
        >
          Finish
        </Button>
      </div>
    </div>
  );
};
