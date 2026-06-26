import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getProfile } from '../api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password });
      // Get user profile to know role
      localStorage.setItem('access_token', res.data.access);
      const profileRes = await getProfile();
      login(
        { username, role: profileRes.data.role },
        res.data.access,
        res.data.refresh
      );
      navigate('/');
    } catch {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>💼 Welcome Back</h2>
        <p className="auth-subtitle">Login to your JobHunt account</p>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
}

export default Login;
