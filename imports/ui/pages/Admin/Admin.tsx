import { useEffect, useMemo, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';
import { JobsCollection } from '/imports/api/jobs';
import { ApplicationsCollection } from '/imports/api/applications/collection';
import { useIsAdmin } from '/imports/ui/hooks/useCurrentUser';
import { SearchBar } from '/imports/ui/components/SearchBar/SearchBar';
import { AdminJobForm } from './AdminJobForm';
import './Admin.css';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
      <line
        x1="13.5"
        y1="13.5"
        x2="18"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Admin() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { isLoading: jobsLoading, jobs, applicantCounts } = useTracker(() => {
    const sub = Meteor.subscribe('jobs.allAdmin');
    const countsSub = Meteor.subscribe('applications.adminCounts');

    const counts: Record<string, number> = {};
    if (countsSub.ready()) {
      for (const app of ApplicationsCollection.find({}, { fields: { jobId: 1 } }).fetch()) {
        counts[app.jobId] = (counts[app.jobId] ?? 0) + 1;
      }
    }

    return {
      isLoading: !sub.ready(),
      jobs: JobsCollection.find({}, { sort: { postedAt: -1 } }).fetch(),
      applicantCounts: counts,
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((job) =>
      [job.title, job.company, job.location].some((field) => field?.toLowerCase().includes(q))
    );
  }, [jobs, searchQuery]);

  const closeModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  useEffect(() => {
    if (!pendingDelete) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDelete, deleting]);

  if (adminLoading) {
    return (
      <div className="admin">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleToggleActive = (jobId: string | undefined, current: boolean) => {
    if (!jobId) return;
    Meteor.callAsync('jobs.update', jobId, { isActive: !current }).catch((err) =>
      console.error('Failed to update job:', err)
    );
  };

  const handleDelete = (jobId: string | undefined, title: string) => {
    if (!jobId) return;
    setPendingDelete({ id: jobId, title });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      setDeleting(true);
      await Meteor.callAsync('jobs.remove', pendingDelete.id);
      setPendingDelete(null);
    } catch (err) {
      console.error('Failed to delete job:', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="admin">
      <div className="admin__container">
        <header className="admin__header">
          <h1 className="admin__title">Admin Panel</h1>
          <p className="admin__subtitle">Manage job listings</p>
        </header>

        <AdminJobForm />

        {!jobsLoading && jobs.length > 0 && (
          <form className="admin__search" role="search" onSubmit={(e) => e.preventDefault()}>
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={setSearchQuery}
              placeholder="Filter by title, company, or location"
              ariaLabel="Filter jobs by title, company, or location"
              showButton={false}
              icon={<SearchIcon />}
            />
            <span className="admin__search-count">
              {filteredJobs.length} of {jobs.length}
            </span>
          </form>
        )}

        {jobsLoading ? (
          <p className="admin__loading">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="admin__empty">No jobs found.</p>
        ) : filteredJobs.length === 0 ? (
          <p className="admin__empty">No jobs match "{searchQuery}".</p>
        ) : (
          <div className="admin__table-wrapper">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Applicants</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id} className={job.isActive ? '' : 'admin__row--inactive'}>
                    <td className="admin__cell-title">{job.title}</td>
                    <td>{job.company}</td>
                    <td>
                      <span className="chip">{job.jobType}</span>
                    </td>
                    <td className="admin__cell-applicants">
                      {applicantCounts[job._id ?? ''] ?? 0}
                    </td>
                    <td className="admin__cell-date">{formatDate(job.postedAt)}</td>
                    <td>
                      <span
                        className={`admin__status ${job.isActive ? 'admin__status--active' : 'admin__status--inactive'}`}
                      >
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin__actions">
                        <button
                          type="button"
                          className={`admin__toggle-btn ${job.isActive ? 'admin__toggle-btn--deactivate' : 'admin__toggle-btn--activate'}`}
                          onClick={() => handleToggleActive(job._id, job.isActive)}
                        >
                          {job.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          className="admin__toggle-btn admin__delete-btn"
                          onClick={() => handleDelete(job._id, job.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingDelete && (
        <div className="admin-modal__overlay" onMouseDown={closeModal} role="presentation">
          <div
            className="admin-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            aria-describedby="admin-modal-desc"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="admin-modal-title" className="admin-modal__title">
              Delete job posting?
            </h2>
            <p id="admin-modal-desc" className="admin-modal__body">
              This permanently removes <strong>"{pendingDelete.title}"</strong> and cannot be
              undone.
            </p>
            <div className="admin-modal__actions">
              <button
                type="button"
                className="admin-modal__btn admin-modal__btn--cancel"
                onClick={closeModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-modal__btn admin-modal__btn--confirm"
                onClick={confirmDelete}
                disabled={deleting}
                autoFocus
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
