import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import MyJobs from './pages/MyJobs';
import JobApplications from './pages/JobApplications';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Employer routes */}
          <Route path="/post-job" element={<PrivateRoute role="employer"><PostJob /></PrivateRoute>} />
          <Route path="/edit-job/:id" element={<PrivateRoute role="employer"><EditJob /></PrivateRoute>} />
          <Route path="/my-jobs" element={<PrivateRoute role="employer"><MyJobs /></PrivateRoute>} />
          <Route path="/job/:id/applications" element={<PrivateRoute role="employer"><JobApplications /></PrivateRoute>} />

          {/* Seeker routes */}
          <Route path="/my-applications" element={<PrivateRoute role="seeker"><MyApplications /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
