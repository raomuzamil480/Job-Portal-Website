import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'seeker', company_name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.username?.[0] || data?.detail || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form signup-form" onSubmit={handleSubmit}>
        <h2>💼 Join JobHunt</h2>
        <p className="auth-subtitle">Create your account</p>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Account created! Redirecting to login...</p>}

        {/* Role Selection */}
        <div className="role-selector">
          <div
            className={`role-option ${form.role === 'seeker' ? 'selected' : ''}`}
            onClick={() => setForm({ ...form, role: 'seeker' })}
          >
            <span>👤</span>
            <strong>Job Seeker</strong>
            <small>Find jobs & apply</small>
          </div>
          <div
            className={`role-option ${form.role === 'employer' ? 'selected' : ''}`}
            onClick={() => setForm({ ...form, role: 'employer' })}
          >
            <span>🏢</span>
            <strong>Employer</strong>
            <small>Post jobs & hire</small>
          </div>
        </div>

        <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />

        {form.role === 'employer' && (
          <input type="text" placeholder="Company Name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
        )}

        <button type="submit">Create Account</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Signup;
