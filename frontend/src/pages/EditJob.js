import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, updateJob, getCategories } from '../api';
import { JobForm } from './PostJob';

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data));
    getJob(id).then((r) => {
      const j = r.data;
      setForm({
        title: j.title, location: j.location, job_type: j.job_type,
        experience: j.experience, salary_min: j.salary_min || '',
        salary_max: j.salary_max || '', description: j.description,
        requirements: j.requirements || '', skills_required: j.skills_required || '',
        status: j.status, deadline: j.deadline || '',
        category_id: j.category?.id || '',
      });
    });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJob(id, form);
      navigate(`/job/${id}`);
    } catch {
      setError('Failed to update job.');
    }
  };

  if (!form) return <div className="loading">Loading...</div>;

  return <JobForm form={form} onChange={handleChange} onSubmit={handleSubmit} categories={categories} error={error} title="Edit Job" submitLabel="Update Job" />;
}

export default EditJob;
