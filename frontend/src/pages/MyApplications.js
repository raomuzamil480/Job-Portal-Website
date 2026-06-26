import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../api';

const statusColors = {
  applied: '#6b7280', reviewing: '#3b82f6', shortlisted: '#8b5cf6',
  interviewed: '#f59e0b', offered: '#10b981', rejected: '#ef4444',
};

const statusLabels = {
  applied: 'Application Submitted', reviewing: 'Under Review',
  shortlisted: 'Shortlisted 🎉', interviewed: 'Interview Scheduled',
  offered: 'Offer Extended 🎊', rejected: 'Not Selected',
};

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then((r) => { setApplications(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-page">
      <h2>My Applications</h2>
      <p className="subtitle">{applications.length} total applications</p>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>You haven't applied to any jobs yet.</p>
          <Link to="/" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="my-apps-list">
          {applications.map((app) => (
            <div key={app.id} className="my-app-card">
              <div className="my-app-info">
                <h3><Link to={`/job/${app.job_id}`}>{app.job_title}</Link></h3>
                <p className="company-name">🏢 {app.job_company}</p>
                <p className="applied-date">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
              </div>
              <div className="my-app-status">
                <span className="status-pill" style={{ background: statusColors[app.status] }}>
                  {statusLabels[app.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
