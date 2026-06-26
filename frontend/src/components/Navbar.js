import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">💼 JobHunt</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Find Jobs</Link>
        {user ? (
          <>
            {user.role === 'employer' ? (
              <>
                <Link to="/post-job" className="btn-post">+ Post Job</Link>
                <Link to="/my-jobs">My Jobs</Link>
              </>
            ) : (
              <Link to="/my-applications">My Applications</Link>
            )}
            <Link to="/profile">Profile</Link>
            <div className="user-menu">
              <span className="username-badge">
                {user.role === 'employer' ? '🏢' : '👤'} {user.username}
              </span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
