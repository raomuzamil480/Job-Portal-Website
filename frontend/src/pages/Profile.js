import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api';

function Profile() {
  const [form, setForm] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile().then((r) => setForm(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to update profile.');
    }
  };

  if (!form) return <div className="loading">Loading...</div>;

  return (
    <div className="form-page">
      <h2>My Profile</h2>
      <div className="profile-role-badge">{form.role === 'employer' ? '🏢 Employer' : '👤 Job Seeker'}</div>

      {success && <p className="success">Profile updated successfully!</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {form.role === 'employer' && (
          <>
            <div className="form-group">
              <label>Company Name</label>
              <input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Your company name" />
            </div>
            <div className="form-group">
              <label>Company Website</label>
              <input type="url" value={form.company_website} onChange={(e) => setForm({ ...form, company_website: e.target.value })} placeholder="https://yourcompany.com" />
            </div>
          </>
        )}

        {form.role === 'seeker' && (
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Python, SQL..." />
          </div>
        )}

        <div className="form-group">
          <label>Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 xxx xxx xxxx" />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} placeholder="Tell us about yourself..." />
        </div>

        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
}

export default Profile;
