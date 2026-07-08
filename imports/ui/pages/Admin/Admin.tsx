import { Fragment, useEffect, useMemo, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';
import { JobsCollection, type Job } from '/imports/api/jobs';
import { ApplicationsCollection } from '/imports/api/applications/collection';
import { useIsAdmin } from '/imports/ui/hooks/useCurrentUser';
import { SearchBar } from '/imports/ui/components/SearchBar/SearchBar';
import { Pagination } from '/imports/ui/components/Pagination/Pagination';
import { AdminJobForm, AdminSettingsForm, AdminUserManager } from '/imports/ui/pages/Admin';
import { JobDetailsModal } from '/imports/ui/pages/Admin/JobDetailsModal';
import './Admin.css';

const JOBS_PER_PAGE = 20;

function formatDollar(n: number): string {
  return n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
}

function formatPay(job: Job): string {
  const unit = job.payUnit === 'salary' ? '/yr' : '/hr';
  if (job.payMax && job.payMax !== job.basePay) {
    return `${formatDollar(job.basePay)} – ${formatDollar(job.payMax)}${unit}`;
  }
  return `${formatDollar(job.basePay)}${unit}`;
}

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

type AdminTab = 'jobs' | 'users' | 'settings';

export function Admin() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  const [activeTab, setActiveTab] = useState<AdminTab>('jobs');

  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    isLoading: jobsLoading,
    jobs,
    applicantCounts,
  } = useTracker(() => {
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

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const pagedJobs = useMemo(
    () => filteredJobs.slice((safePage - 1) * JOBS_PER_PAGE, safePage * JOBS_PER_PAGE),
    [filteredJobs, safePage]
  );

  const pageStart = filteredJobs.length === 0 ? 0 : (safePage - 1) * JOBS_PER_PAGE + 1;
  const pageEnd = Math.min(safePage * JOBS_PER_PAGE, filteredJobs.length);

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
          <p className="admin__subtitle">
            {activeTab === 'jobs'
              ? 'Manage job listings'
              : activeTab === 'users'
                ? 'Search and manage user accounts'
                : 'Manage site content and contact details'}
          </p>
        </header>

        <div className="admin__tabs" role="tablist" aria-label="Admin sections">
          <button
            type="button"
            role="tab"
            id="admin-tab-jobs"
            aria-selected={activeTab === 'jobs'}
            aria-controls="admin-panel-jobs"
            className={`admin__tab ${activeTab === 'jobs' ? 'admin__tab--active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Job Postings
          </button>
          <button
            type="button"
            role="tab"
            id="admin-tab-users"
            aria-selected={activeTab === 'users'}
            aria-controls="admin-panel-users"
            className={`admin__tab ${activeTab === 'users' ? 'admin__tab--active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Search
          </button>
          <button
            type="button"
            role="tab"
            id="admin-tab-settings"
            aria-selected={activeTab === 'settings'}
            aria-controls="admin-panel-settings"
            className={`admin__tab ${activeTab === 'settings' ? 'admin__tab--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Site Settings
          </button>
        </div>

        {activeTab === 'jobs' && (
          <div
            id="admin-panel-jobs"
            role="tabpanel"
            aria-labelledby="admin-tab-jobs"
            className="admin__tabpanel"
          >
            <AdminJobForm
              leftSlot={
                !jobsLoading && jobs.length > 0 ? (
                  <form
                    className="admin__search"
                    role="search"
                    onSubmit={(e) => e.preventDefault()}
                  >
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
                ) : undefined
              }
            />

            {jobsLoading ? (
              <p className="admin__loading">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="admin__empty">No jobs found.</p>
            ) : filteredJobs.length === 0 ? (
              <p className="admin__empty">No jobs match "{searchQuery}".</p>
            ) : (
              <>
                <div className="admin__table-wrapper">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th className="admin__col-hide-mobile">Type</th>
                        <th className="admin__col-hide-mobile">Applicants</th>
                        <th className="admin__col-hide-mobile">Posted</th>
                        <th className="admin__col-hide-mobile">Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedJobs.map((job) => (
                        <Fragment key={job._id}>
                          <tr
                            className={`admin__row admin__row--clickable ${job.isActive ? '' : 'admin__row--inactive'}`}
                            onClick={() => setSelectedJob(job)}
                          >
                            <td className="admin__cell-title">
                              <button
                                type="button"
                                className="admin__row-trigger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedJob(job);
                                }}
                              >
                                {job.title}
                              </button>
                            </td>
                            <td className="admin__cell-company">{job.company}</td>
                            <td className="admin__col-hide-mobile">
                              <span className="admin__cell-job-type">{job.jobType}</span>
                            </td>
                            <td className="admin__cell-applicants admin__col-hide-mobile">
                              {applicantCounts[job._id ?? ''] ?? 0}
                            </td>
                            <td className="admin__cell-date admin__col-hide-mobile">
                              {formatDate(job.postedAt)}
                            </td>
                            <td className="admin__col-hide-mobile">
                              <span
                                className={`admin__status ${job.isActive ? 'admin__status--active' : 'admin__status--inactive'}`}
                              >
                                {job.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="admin__cell-actions">
                              <div className="admin__actions">
                                <button
                                  type="button"
                                  className={`admin__toggle-btn ${job.isActive ? 'admin__toggle-btn--deactivate' : 'admin__toggle-btn--activate'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleActive(job._id, job.isActive);
                                  }}
                                >
                                  {job.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  className="admin__toggle-btn admin__delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(job._id, job.title);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Mobile-only detail row: surfaces the columns hidden above. */}
                          <tr
                            className={`admin__subrow admin__row--clickable ${job.isActive ? '' : 'admin__row--inactive'}`}
                            onClick={() => setSelectedJob(job)}
                          >
                            <td className="admin__subrow-cell" colSpan={3}>
                              <span className="admin__meta">
                                <span className="admin__meta-label">Type</span>
                                <span className="admin__cell-job-type">{job.jobType}</span>
                              </span>
                              <span className="admin__meta">
                                <span className="admin__meta-label">Pay</span>
                                {formatPay(job)}
                              </span>
                              <span className="admin__meta">
                                <span className="admin__meta-label">Applicants</span>
                                {applicantCounts[job._id ?? ''] ?? 0}
                              </span>
                              <span className="admin__meta">
                                <span className="admin__meta-label">Posted</span>
                                {formatDate(job.postedAt)}
                              </span>
                              <span className="admin__meta">
                                <span className="admin__meta-label">Status</span>
                                <span
                                  className={`admin__status ${job.isActive ? 'admin__status--active' : 'admin__status--inactive'}`}
                                >
                                  {job.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </span>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  ariaLabel="Job postings pagination"
                  summary={`Showing ${pageStart}–${pageEnd} of ${filteredJobs.length} jobs`}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div
            id="admin-panel-users"
            role="tabpanel"
            aria-labelledby="admin-tab-users"
            className="admin__tabpanel"
          >
            <AdminUserManager />
          </div>
        )}

        {activeTab === 'settings' && (
          <div
            id="admin-panel-settings"
            role="tabpanel"
            aria-labelledby="admin-tab-settings"
            className="admin__tabpanel"
          >
            <AdminSettingsForm />
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          applicantCount={applicantCounts[selectedJob._id ?? ''] ?? 0}
          onClose={() => setSelectedJob(null)}
          onUpdated={(updated) => setSelectedJob(updated)}
        />
      )}

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
