import React, { useRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

import '../../../api/profiles/methods';
import { Button } from '../../components/Button/Button';
import './Onboarding.css';

interface Skill {
  id: number;
  value: string;
}

export const OnboardingSkills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const nextId = useRef(0);

  const addSkill = () => {
    const trimmedInput = skillInput.trim();
    if (!trimmedInput) return;
    setSkills((prevSkills) => [...prevSkills, { id: nextId.current++, value: trimmedInput }]);
    setSkillInput('');
  };

  const removeSkill = (id: number) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleFinish = async () => {
    const skillValues = skills.map((s) => s.value);
    try {
      setError('');
      setIsLoading(true);
      await Meteor.callAsync('UserProfiles.upsert', { skills: skillValues });
      navigate('/jobs');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-personal">
      <div className="onboarding-personal__header">
        <div className="onboarding-personal__nav">
          <div className="btn-back">
            <button
              type="button"
              className="onboarding-personal__btn btn-back"
              onClick={() => navigate(-1)}
            >
              <img src="/assets/skip.svg" alt="Back" />
            </button>
          </div>

          <div className="onboarding-personal__logo">
            <img src="/assets/company-logo.svg" alt="Logo" />
          </div>

          <button
            type="button"
            className="onboarding-personal__btn btn-skip"
            onClick={() => navigate('/jobs')}
          >
            Skip <img src="/assets/skip.svg" alt="Skip" />
          </button>
        </div>

        <h1 className="onboarding-personal__title top-title">Profile Builder</h1>
        <p className="onboarding-personal__subtitle">Page 3 of 3</p>
      </div>

      <div className="onboarding-personal__main-contents">
        <div className="onboarding-personal__main-content">
          <div className="onboarding-personal__description">
            <h2 className="onboarding-personal__title">Add your skills.</h2>
            <p className="onboarding-personal__subtitle">
              This is optional, but your answers help us make better job recommendations.
            </p>
          </div>

          <div className="onboarding-personal__inputs">
            <div className="onboarding-personal__input">
              <input
                id="skills"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add skills"
              />
            </div>

            <ul className="onboarding-personal__skills-chips" aria-label="Added skills">
              {skills.map((skill) => (
                <li key={skill.id} className="onboarding-personal__skill-chip">
                  <button
                    type="button"
                    className="onboarding-personal__skill-remove"
                    onClick={() => removeSkill(skill.id)}
                    aria-label={`Remove ${skill.value}`}
                  >
                    <img src="/assets/chip-close.svg" alt="" />
                  </button>
                  {skill.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="onboarding-personal__finish-section">
          {error ? (
            <p className="onboarding-personal__error-text" role="alert">
              {error}
            </p>
          ) : null}
          <div className="onboarding-personal__btn">
            <Button
              variant="primary"
              type="button"
              loading={isLoading}
              disabled={isLoading}
              onClick={handleFinish}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
