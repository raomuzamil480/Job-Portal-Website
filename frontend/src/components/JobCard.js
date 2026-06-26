import React from 'react';
import { Link } from 'react-router-dom';

const typeColors = {
  'full-time': '#3b82f6',
  'part-time': '#8b5cf6',
  'remote': '#10b981',
  'contract': '#f59e0b',
  'internship': '#ec4899',
};

function JobCard({ job }) {
  const daysAgo = Math.floor((Date.now() - new Date(job.created_at)) / 86400000);

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div>
          <h3><Link to={`/job/${job.id}`}>{job.title}</Link></h3>
          <p className="company-name">🏢 {job.company}</p>
        </div>
        {job.has_applied && <span className="applied-badge">✅ Applied</span>}
      </div>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span style={{ background: typeColors[job.job_type] }} className="type-badge">
          {job.job_type.replace('-', ' ')}
        </span>
        {job.category && <span className="cat-pill">{job.category.name}</span>}
      </div>

      <div className="job-tags">
        {job.skills_required && job.skills_required.split(',').slice(0, 4).map((s, i) => (
          <span key={i} className="skill-tag">{s.trim()}</span>
        ))}
      </div>

      <div className="job-footer">
        <span className="salary">{job.salary_display}</span>
        <span className="posted-date">{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
      </div>

      <Link to={`/job/${job.id}`} className="view-job-btn">View Details →</Link>
    </div>
  );
}

export default JobCard;
