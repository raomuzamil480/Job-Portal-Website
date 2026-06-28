import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob, getCategories } from '../api';

function PostJob() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', company: '', location: '', job_type: 'full-time', experience: 'entry',
    salary_min: '', salary_max: '', description: '', requirements: '',
    skills_required: '', status: 'open', deadline: '', category_id: '',
  });

  useEffect(() => { getCategories().then((r) => setCategories(r.data)); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = { ...form };
      if (!data.salary_min) delete data.salary_min;
      if (!data.salary_max) delete data.salary_max;
      if (!data.deadline) delete data.deadline;
      if (!data.category_id) delete data.category_id;
      const res = await createJob(data);
      navigate(`/job/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job.');
    }
  };

  return <JobForm form={form} onChange={handleChange} onSubmit={handleSubmit} categories={categories} error={error} title="Post a New Job" submitLabel="Post Job" />;
}

export default PostJob;

export function JobForm({ form, onChange, onSubmit, categories, error, title, submitLabel }) {
  return (
    <div className="form-page">
      <h2>{title}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Job Title *</label>
            <input name="title" value={form.title} onChange={onChange} placeholder="e.g. Senior React Developer" required />
          </div>

          <div className="form-group">
            <label>Company Name *</label>
            <input name="company" value={form.company} onChange={onChange} placeholder="e.g. TechCorp Inc." required />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input name="location" value={form.location} onChange={onChange} placeholder="e.g. New York, USA" required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category_id" value={form.category_id} onChange={onChange}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Job Type</label>
            <select name="job_type" value={form.job_type} onChange={onChange}>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select name="experience" value={form.experience} onChange={onChange}>
              <option value="entry">Entry Level (0-1 yr)</option>
              <option value="junior">Junior (1-3 yrs)</option>
              <option value="mid">Mid Level (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Salary Min (USD)</label>
            <input name="salary_min" type="number" value={form.salary_min} onChange={onChange} placeholder="e.g. 50000" />
          </div>

          <div className="form-group">
            <label>Salary Max (USD)</label>
            <input name="salary_max" type="number" value={form.salary_max} onChange={onChange} placeholder="e.g. 80000" />
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={onChange} />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={onChange}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="form-group span-2">
            <label>Job Description *</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={6} placeholder="Describe the role, responsibilities, team culture..." required />
          </div>

          <div className="form-group span-2">
            <label>Requirements</label>
            <textarea name="requirements" value={form.requirements} onChange={onChange} rows={4} placeholder="One requirement per line..." />
          </div>

          <div className="form-group span-2">
            <label>Required Skills</label>
            <input name="skills_required" value={form.skills_required} onChange={onChange} placeholder="React, TypeScript, Node.js, SQL (comma separated)" />
          </div>
        </div>

        <button type="submit" className="submit-btn">{submitLabel}</button>
      </form>
    </div>
  );
}