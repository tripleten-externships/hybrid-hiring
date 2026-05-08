import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { JobsCollection } from '/imports/api/jobs';
import { useMyProfile, useCurrentUser } from '/imports/ui/hooks/useCurrentUser';
import JobCard from '/imports/ui/components/JobCard/JobCard';
import './Account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleDollarToSlot,
  faLocationDot,
  faBriefcase,
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
          <div className="account__avatar">{initials || '?'}</div>
          <div className="account__hero-info">
            <h1 className="account__name">{fullName}</h1>
            <p className="account__email">{user?.emails?.[0]?.address}</p>
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
