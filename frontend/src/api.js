import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser    = (d) => api.post('/register/', d);
export const loginUser       = (d) => api.post('/login/', d);
export const getProfile      = () => api.get('/profile/');
export const updateProfile   = (d) => api.put('/profile/', d);

// Jobs
export const getJobs         = (p) => api.get('/jobs/', { params: p });
export const getJob          = (id) => api.get(`/jobs/${id}/`);
export const createJob       = (d) => api.post('/jobs/', d);
export const updateJob       = (id, d) => api.put(`/jobs/${id}/`, d);
export const deleteJob       = (id) => api.delete(`/jobs/${id}/`);
export const getMyJobs       = () => api.get('/jobs/my_jobs/');
export const applyToJob      = (id, d) => api.post(`/jobs/${id}/apply/`, d);
export const getJobApplications = (id) => api.get(`/jobs/${id}/applications/`);

// Categories
export const getCategories   = () => api.get('/categories/');

// Applications
export const getMyApplications  = () => api.get('/my-applications/');
export const updateAppStatus    = (id, status) => api.patch(`/applications/${id}/status/`, { status });

export default api;
