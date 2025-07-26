import API from './config.js';

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchJobs = () => {
  return API.get('/jobs');
};

export const fetchJob = (id) => {
  return API.get(`/jobs/${id}`);
};

export const createJob = (jobData) => {
  return API.post('/jobs', jobData);
};

export const updateJob = (id, jobData) => {
  return API.put(`/jobs/${id}`, jobData);
};

export const deleteJob = (id) => {
  return API.delete(`/jobs/${id}`);
};

export const applyForJob = (jobId, applicantData) => API.post('/applications/apply', { jobId, ...applicantData });
export const getMyApplications = () => API.get('/applications/my-applications');
export const getMyPostedJobs = () => API.get('/jobs/my-posted-jobs');

export const fetchJobApplicants = (id) => {
  return API.get(`/jobs/${id}/applicants`);
};

export const fetchJobsByUser = () => {
  return API.get(`/jobs/my-jobs`);
};

export const fetchFeaturedJobs = () => {
  return API.get('/jobs/featured');
}; 

export const fetchRecommendedJobs = () => API.get('/jobs/recommended'); 