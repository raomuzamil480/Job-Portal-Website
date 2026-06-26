import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, applyToJob, deleteJob } from '../api';
import { useAuth } from '../context/AuthContext';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getJob(id).then((r) => setJob(r.data)).catch(() => navigate('/'));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setApplying(true);
    try {
      await applyToJob(id, { cover_letter: coverLetter, resume_link: resumeLink });
      setSuccess(true);
      setShowApply(false);
      setJob((j) => ({ ...j, has_applied: true }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this job posting?')) {
      await deleteJob(id);
      navigate('/my-jobs');
    }
  };

  if (!job) return <div className="loading">Loading...</div>;

  const isEmployer = user && user.role === 'employer' && user.username === job.employer_name;

  return (
    <div className="job-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Jobs</button>

      <div className="job-detail-layout">
        {/* Main Content */}
        <div className="job-detail-main">
          <div className="job-detail-header">
            <div>
              <h1>{job.title}</h1>
              <p className="company-lg">🏢 {job.company}</p>
            </div>
            <div className="job-status-badge" style={{ background: job.status === 'open' ? '#10b981' : '#ef4444' }}>
              {job.status === 'open' ? 'Actively Hiring' : 'Closed'}
            </div>
          </div>

          <div className="job-detail-meta">
            <span>📍 {job.location}</span>
            <span>💼 {job.job_type?.replace('-', ' ')}</span>
            <span>📊 {job.experience?.replace('-', ' ')}</span>
            <span>💰 {job.salary_display}</span>
            {job.deadline && <span>⏰ Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
            {job.category && <span>🏷️ {job.category.name}</span>}
          </div>

          {isEmployer && (
            <div className="employer-actions">
              <Link to={`/job/${id}/applications`} className="btn-view-apps">
                📋 View Applications ({job.applications_count})
              </Link>
              <Link to={`/edit-job/${id}`} className="btn-edit">Edit Job</Link>
              <button onClick={handleDelete} className="btn-delete">Delete</button>
            </div>
          )}

          <div className="job-section">
            <h3>Job Description</h3>
            <div className="job-text">
              {job.description?.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          {job.requirements && (
            <div className="job-section">
              <h3>Requirements</h3>
              <ul className="requirements-list">
                {job.requirements.split('\n').map((r, i) => r.trim() && <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {job.skills_required && (
            <div className="job-section">
              <h3>Required Skills</h3>
              <div className="skills-list">
                {job.skills_required.split(',').map((s, i) => (
                  <span key={i} className="skill-tag-lg">{s.trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="job-detail-sidebar">
          <div className="apply-box">
            {success ? (
              <div className="success-box">
                ✅ Application submitted successfully!
              </div>
            ) : job.has_applied ? (
              <div className="success-box">✅ You have already applied</div>
            ) : user?.role === 'seeker' && job.status === 'open' ? (
              <button className="apply-btn" onClick={() => setShowApply(true)}>
                Apply Now
              </button>
            ) : !user ? (
              <Link to="/login" className="apply-btn">Login to Apply</Link>
            ) : null}

            <div className="job-summary">
              <div className="summary-item"><span>Posted</span><strong>{new Date(job.created_at).toLocaleDateString()}</strong></div>
              <div className="summary-item"><span>Applications</span><strong>{job.applications_count}</strong></div>
              <div className="summary-item"><span>Job Type</span><strong>{job.job_type?.replace('-', ' ')}</strong></div>
              <div className="summary-item"><span>Experience</span><strong>{job.experience}</strong></div>
              <div className="summary-item"><span>Salary</span><strong>{job.salary_display}</strong></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="modal-overlay" onClick={() => setShowApply(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Apply for: {job.title}</h3>
            <p className="modal-company">{job.company}</p>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Cover Letter *</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a great fit for this role? Tell us about your experience and motivation..."
                  rows={6}
                  required
                />
              </div>
              <div className="form-group">
                <label>Resume Link (optional)</label>
                <input
                  type="url"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  placeholder="https://drive.google.com/your-resume"
                />
                <small>Google Drive, LinkedIn, Dropbox link etc.</small>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowApply(false)} className="btn-cancel">Cancel</button>
                <button type="submit" disabled={applying} className="btn-submit">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
