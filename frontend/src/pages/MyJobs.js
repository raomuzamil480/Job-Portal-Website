import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, deleteJob } from '../api';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => getMyJobs().then((r) => { setJobs(r.data); setLoading(false); });
  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      await deleteJob(id);
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>My Job Postings</h2>
        <Link to="/post-job" className="btn-primary">+ Post New Job</Link>
      </div>

      {loading ? <div className="loading">Loading...</div> : jobs.length === 0 ? (
        <div className="empty-state">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn-primary">Post Your First Job</Link>
        </div>
      ) : (
        <div className="my-jobs-list">
          {jobs.map((job) => (
            <div key={job.id} className="my-job-card">
              <div className="my-job-info">
                <h3><Link to={`/job/${job.id}`}>{job.title}</Link></h3>
                <div className="my-job-meta">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.job_type}</span>
                  <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                  <span className={`status-dot ${job.status}`}>{job.status}</span>
                </div>
              </div>
              <div className="my-job-stats">
                <div className="stat">
                  <strong>{job.applications_count}</strong>
                  <span>Applications</span>
                </div>
              </div>
              <div className="my-job-actions">
                <Link to={`/job/${job.id}/applications`} className="btn-sm btn-blue">Applications</Link>
                <Link to={`/edit-job/${job.id}`} className="btn-sm btn-gray">Edit</Link>
                <button onClick={() => handleDelete(job.id)} className="btn-sm btn-red">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyJobs;
