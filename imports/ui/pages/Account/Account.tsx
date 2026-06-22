import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { JobsCollection } from '/imports/api/jobs';
import { useMyProfile, useCurrentUser, useMyAppliedJobIds } from '/imports/ui/hooks/useCurrentUser';
import { fileToSquareDataUrl } from '/imports/ui/utils/image';
import JobCard from '/imports/ui/components/JobCard/JobCard';
import './Account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleDollarToSlot,
  faLocationDot,
  faBriefcase,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';

function LocationIcon() {
  return <FontAwesomeIcon icon={faLocationDot} className="account__pref-icon" />;
}

function BriefcaseIcon() {
  return <FontAwesomeIcon icon={faBriefcase} className="account__pref-icon" />;
}

function PayIcon() {
  return <FontAwesomeIcon icon={faCircleDollarToSlot} className="account__pref-icon" />;
}

function SkillsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 4h12M2 8h8M2 12h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2h8a1 1 0 0 1 1 1v10.382a.5.5 0 0 1-.776.416L8 11.118l-4.224 2.68A.5.5 0 0 1 3 13.382V3a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function Account() {
  const user = useCurrentUser();
  const { profile, isLoading: profileLoading } = useMyProfile();
  const savedJobIds = profile?.savedJobs ?? [];
  const appliedJobIds = useMyAppliedJobIds();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the avatar menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarError('');
    setAvatarUploading(true);
    try {
      const dataUrl = await fileToSquareDataUrl(file);
      await Meteor.callAsync('UserProfiles.setAvatar', dataUrl);
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setAvatarError(reason || (err instanceof Error ? err.message : 'Failed to upload photo.'));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setMenuOpen(false);
    setAvatarError('');
    setAvatarUploading(true);
    try {
      await Meteor.callAsync('UserProfiles.removeAvatar');
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setAvatarError(reason || 'Failed to remove photo.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const { isLoading: jobsLoading, savedJobs } = useTracker(() => {
    const sub = Meteor.subscribe('jobs.all');
    return {
      isLoading: !sub.ready(),
      savedJobs: JobsCollection.find({ _id: { $in: savedJobIds } }).fetch(),
    };
  }, [savedJobIds.join(',')]);

  const isLoading = profileLoading || jobsLoading;

  const userProfile = user?.profile as
    | { name?: string; firstName?: string; lastName?: string }
    | undefined;
  const fullName =
    userProfile?.name ||
    (userProfile?.firstName
      ? `${userProfile.firstName} ${userProfile.lastName ?? ''}`.trim()
      : null) ||
    user?.username ||
    user?.emails?.[0]?.address ||
    'Your Account';

  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');

  const formatPay = () => {
    if (!profile?.minPay) return null;
    const unit = profile.payUnit === 'yearly' ? '/yr' : '/hr';
    const amount =
      profile.minPay >= 1000 ? `$${Math.round(profile.minPay / 1000)}K` : `$${profile.minPay}`;
    return `${amount}${unit}`;
  };

  const locationStr = [profile?.city, profile?.state].filter(Boolean).join(', ');

  return (
    <div className="account">
      {/* ─── Hero banner ─── */}
      <div className="account__hero">
        <div className="account__hero-inner">
          <div className="account__avatar-wrap">
            <div className="account__avatar">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" className="account__avatar-img" />
              ) : (
                initials || '?'
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatarChange}
              hidden
            />
            <div className="account__avatar-menu" ref={menuRef}>
              <button
                type="button"
                className="account__avatar-btn"
                onClick={() => setMenuOpen((o) => !o)}
                disabled={avatarUploading}
                aria-label="Edit profile photo"
                title="Edit profile photo"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <FontAwesomeIcon icon={faPencil} />
              </button>
              {menuOpen && (
                <div className="account__avatar-dropdown" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="account__avatar-option"
                    onClick={() => {
                      setMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                  >
                    {profile?.avatar ? 'Change photo' : 'Upload photo'}
                  </button>
                  {profile?.avatar && (
                    <button
                      type="button"
                      role="menuitem"
                      className="account__avatar-option account__avatar-option--danger"
                      onClick={handleRemoveAvatar}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="account__hero-info">
            <h1 className="account__name">{fullName}</h1>
            <p className="account__email">{user?.emails?.[0]?.address}</p>
            {avatarUploading && <p className="account__avatar-status">Updating photo…</p>}
            {avatarError && (
              <p className="account__avatar-status account__avatar-status--error" role="alert">
                {avatarError}
              </p>
            )}
          </div>
          <Link to="/onboarding/personal" className="account__edit-btn">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="account__body">
        {/* ─── Preferences card ─── */}
        {!profileLoading && (
          <section className="account__card">
            <h2 className="account__card-title">Your Preferences</h2>

            {!profile ? (
              <div className="account__empty-pref">
                <p>No preferences set yet.</p>
                <Link to="/onboarding/personal" className="account__cta-link">
                  Set up your profile →
                </Link>
              </div>
            ) : (
              <dl className="account__prefs">
                {locationStr && (
                  <div className="account__pref-row">
                    <dt>
                      <LocationIcon /> Location
                    </dt>
                    <dd>{locationStr}</dd>
                  </div>
                )}
                {profile.jobTypes && profile.jobTypes.length > 0 && (
                  <div className="account__pref-row">
                    <dt>
                      <BriefcaseIcon /> Job Types
                    </dt>
                    <dd>
                      <div className="account__chips">
                        {profile.jobTypes.map((type) => (
                          <span key={type} className="account__chip">
                            {type}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
                {formatPay() && (
                  <div className="account__pref-row">
                    <dt>
                      <PayIcon /> Min. Pay
                    </dt>
                    <dd>{formatPay()}</dd>
                  </div>
                )}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="account__pref-row">
                    <dt>
                      <SkillsIcon /> Skills
                    </dt>
                    <dd>
                      <div className="account__chips">
                        {profile.skills.map((skill) => (
                          <span key={skill} className="account__chip">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </section>
        )}

        {/* ─── Saved jobs ─── */}
        <section className="account__card">
          <div className="account__card-header">
            <h2 className="account__card-title">
              <BookmarkIcon />
              Saved Jobs
              {savedJobIds.length > 0 && (
                <span className="account__badge">{savedJobIds.length}</span>
              )}
            </h2>
            <Link to="/jobs" className="account__browse-link">
              Browse more →
            </Link>
          </div>

          {isLoading ? (
            <div className="account__skeletons">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="job-card-skeleton" />
              ))}
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="account__empty-jobs">
              <p>You haven't saved any jobs yet.</p>
              <Link to="/jobs" className="account__cta-link">
                Start browsing →
              </Link>
            </div>
          ) : (
            <div className="account__jobs-grid">
              {savedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={true}
                  hasApplied={appliedJobIds.has(job._id ?? '')}
                  onSave={() => Meteor.callAsync('UserProfiles.toggleSaveJob', job._id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
