import React, { useEffect, useRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { useMyProfile } from '../../hooks/useCurrentUser';

import '../../../api/profiles/methods';
import './Onboarding.css';

interface Skill {
  id: number;
  value: string;
}

/** Splits a comma-separated string into trimmed, non-empty values. */
function splitSkills(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

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

export const OnboardingSkills = () => {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useMyProfile();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const nextId = useRef(0);
  const hydratedRef = useRef(false);

  // Pre-populate from the saved profile so finishing this step never wipes
  // skills the user already had. Split any comma-joined values so each becomes
  // its own chip.
  useEffect(() => {
    if (hydratedRef.current || profileLoading) return;
    hydratedRef.current = true;
    if (profile?.skills?.length) {
      const values = profile.skills.flatMap(splitSkills);
      setSkills(values.map((value) => ({ id: nextId.current++, value })));
    }
  }, [profile, profileLoading]);

  // Adds one or more skills, splitting on commas and skipping duplicates.
  const addSkills = (raw: string) => {
    const additions = splitSkills(raw);
    if (additions.length === 0) return;
    setSkills((prevSkills) => {
      const existing = new Set(prevSkills.map((s) => s.value.toLowerCase()));
      const next = [...prevSkills];
      for (const value of additions) {
        if (!existing.has(value.toLowerCase())) {
          existing.add(value.toLowerCase());
          next.push({ id: nextId.current++, value });
        }
      }
      return next;
    });
    setSkillInput('');
  };

  const removeSkill = (id: number) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      addSkills(skillInput);
    }
  };

  const handleFinish = async () => {
    // Commit any text still in the input (user may not have pressed Enter),
    // splitting on commas and skipping duplicates.
    const existing = new Set(skills.map((s) => s.value.toLowerCase()));
    const pending = splitSkills(skillInput).filter((v) => !existing.has(v.toLowerCase()));
    const skillValues = [...skills.map((s) => s.value), ...pending];
    if (pending.length > 0) {
      setSkills((prev) => [...prev, ...pending.map((value) => ({ id: nextId.current++, value }))]);
      setSkillInput('');
    }

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
    <div className="ob-page">
      <div className="ob-step">
        {/* Nav */}
        <div className="ob-nav">
          <button type="button" className="ob-nav__back" onClick={() => navigate(-1)}>
            <ChevronIcon />
            Back
          </button>
        </div>

        {/* Progress */}
        <div className="ob-progress">
          <h1 className="ob-progress__title">Profile Builder</h1>
          <p className="ob-progress__label">Step 3 of 3</p>
          <div className="ob-progress__dots">
            <span className="ob-progress__dot ob-progress__dot--done" />
            <span className="ob-progress__dot ob-progress__dot--done" />
            <span className="ob-progress__dot ob-progress__dot--active" />
          </div>
        </div>

        {/* Skills card */}
        <div className="ob-card">
          <div className="ob-card__description">
            <h2 className="ob-card__heading">Add your skills</h2>
            <p className="ob-card__subheading">
              Optional, but your answers help us make better job recommendations. Press Enter to add
              each skill.
            </p>
          </div>

          <div className="ob-fields">
            <div className="ob-input">
              <input
                id="skills"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Pipefitting, AutoCAD, Python…"
              />
            </div>

            {skills.length > 0 && (
              <ul className="ob-tags" aria-label="Added skills">
                {skills.map((skill) => (
                  <li key={skill.id} className="ob-tag">
                    {skill.value}
                    <button
                      type="button"
                      className="ob-tag__remove"
                      onClick={() => removeSkill(skill.id)}
                      aria-label={`Remove ${skill.value}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
            onClick={handleFinish}
            disabled={isLoading}
          >
            {isLoading ? 'Saving…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};
