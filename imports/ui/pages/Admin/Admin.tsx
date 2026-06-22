import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';
import { JobsCollection } from '/imports/api/jobs';
import { useIsAdmin } from '/imports/ui/hooks/useCurrentUser';
import { AdminJobForm } from './AdminJobForm';
import './Admin.css';

export function Admin() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  const { isLoading: jobsLoading, jobs } = useTracker(() => {
    const sub = Meteor.subscribe('jobs.allAdmin');
    return {
      isLoading: !sub.ready(),
      jobs: JobsCollection.find({}, { sort: { postedAt: -1 } }).fetch(),
    };
  }, []);

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
    const confirmed = window.confirm(
      `Delete "${title}"? This permanently removes the posting and cannot be undone.`
    );
    if (!confirmed) return;
    Meteor.callAsync('jobs.remove', jobId).catch((err) =>
      console.error('Failed to delete job:', err)
    );
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

        {jobsLoading ? (
          <p className="admin__loading">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="admin__empty">No jobs found.</p>
        ) : (
          <div className="admin__table-wrapper">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className={job.isActive ? '' : 'admin__row--inactive'}>
                    <td className="admin__cell-title">{job.title}</td>
                    <td>{job.company}</td>
                    <td>
                      <span className="chip">{job.jobType}</span>
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
    </div>
  );
}
