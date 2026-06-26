import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobApplications, updateAppStatus, getJob } from '../api';

const statusColors = {
  applied: '#6b7280', reviewing: '#3b82f6', shortlisted: '#8b5cf6',
  interviewed: '#f59e0b', offered: '#10b981', rejected: '#ef4444',
};

function JobApplications() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getJob(id), getJobApplications(id)]).then(([jRes, aRes]) => {
      setJob(jRes.data);
      setApplications(aRes.data);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    await updateAppStatus(appId, newStatus);
    setApplications(applications.map((a) => a.id === appId ? { ...a, status: newStatus } : a));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <Link to="/my-jobs" className="back-btn">← My Jobs</Link>
          <h2>Applications for: {job?.title}</h2>
          <p>{job?.company} · {applications.length} applicants</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state"><p>No applications yet for this job.</p></div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="applicant-info">
                <div className="applicant-avatar">{app.applicant_name[0].toUpperCase()}</div>
                <div>
                  <h4>{app.applicant_name}</h4>
                  <p>{app.applicant_email}</p>
                  <p className="applied-date">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="cover-letter-preview">
                <strong>Cover Letter:</strong>
                <p>{app.cover_letter.substring(0, 200)}{app.cover_letter.length > 200 ? '...' : ''}</p>
                {app.resume_link && (
                  <a href={app.resume_link} target="_blank" rel="noreferrer" className="resume-link">
                    📄 View Resume
                  </a>
                )}
              </div>

              <div className="app-status-section">
                <span className="status-badge-app" style={{ background: statusColors[app.status] }}>
                  {app.status}
                </span>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className="status-select"
                >
                  <option value="applied">Applied</option>
                  <option value="reviewing">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offered">Offer Extended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobApplications;
