import React, { useState, useEffect } from 'react';
import { getJobs, getCategories } from '../api';
import JobCard from '../components/JobCard';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', job_type: '', experience: '' });
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getJobs({ status: 'open', ...params });
      setJobs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getCategories().then((r) => setCategories(r.data)); }, []);
  useEffect(() => { fetchJobs(filters); }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ ...filters, search });
  };

  const handleFilter = (key, val) => {
    const newFilters = { ...filters, [key]: val };
    setFilters(newFilters);
  };

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <h1>Find Your Dream Job</h1>
        <p>Thousands of jobs from top companies — all in one place</p>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            placeholder="Search by title, skills, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍 Search</button>
        </form>
      </div>

      <div className="home-layout">
        {/* Filters Sidebar */}
        <aside className="sidebar">
          <div className="filter-group">
            <h4>Category</h4>
            <ul>
              <li className={!filters.category ? 'active' : ''} onClick={() => handleFilter('category', '')}>All Categories</li>
              {categories.map((c) => (
                <li key={c.id} className={filters.category === c.slug ? 'active' : ''} onClick={() => handleFilter('category', c.slug)}>
                  {c.name} <span className="count">({c.jobs_count})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4>Job Type</h4>
            <ul>
              {['', 'full-time', 'part-time', 'remote', 'contract', 'internship'].map((t) => (
                <li key={t} className={filters.job_type === t ? 'active' : ''} onClick={() => handleFilter('job_type', t)}>
                  {t ? t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ') : 'All Types'}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4>Experience Level</h4>
            <ul>
              {[
                { val: '', label: 'All Levels' },
                { val: 'entry', label: 'Entry Level' },
                { val: 'junior', label: 'Junior (1-3 yrs)' },
                { val: 'mid', label: 'Mid Level (3-5 yrs)' },
                { val: 'senior', label: 'Senior (5+ yrs)' },
              ].map((e) => (
                <li key={e.val} className={filters.experience === e.val ? 'active' : ''} onClick={() => handleFilter('experience', e.val)}>
                  {e.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Job Listings */}
        <main className="jobs-main">
          <div className="results-header">
            <p><strong>{jobs.length}</strong> jobs found</p>
          </div>
          {loading ? (
            <div className="loading">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <p>😔 No jobs found matching your criteria.</p>
              <button onClick={() => { setFilters({ category: '', job_type: '', experience: '' }); setSearch(''); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
