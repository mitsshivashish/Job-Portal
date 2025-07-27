import React, { useEffect, useState } from 'react';
import { fetchJobs, fetchFeaturedJobs } from '../api/jobs';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import JobCardSkeleton from '../components/loaders/JobCardSkeleton';
import AnimatedSearchBar from '../components/AnimatedSearchBar';
import JobsListSkeleton from '../components/loaders/JobsListSkeleton';
import styled from 'styled-components';

// Shared job categories (should match PostJob.jsx)
const JOB_CATEGORIES = [
  { value: 'Tech', label: 'Technology' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Design', label: 'Design' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Other', label: 'Other' },
];

const MobileFilterDrawer = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  z-index: 1000;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.3s;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  @media (min-width: 768px) { display: none; }
`;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('all');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJobs(),
      fetchFeaturedJobs()
    ]).then(([jobsRes, featuredRes]) => {
      setJobs(jobsRes.data.data);
      setFeaturedJobs(featuredRes.data.data);
      setFeaturedLoading(false);
    }).catch(err => {
      console.error('Failed to fetch jobs:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Filtering logic
  const normalizeJobType = (type) => {
    if (!type) return '';
    const map = {
      'full-time': 'Full-time',
      'Full-time': 'Full-time',
      'Full Time': 'Full-time',
      'part-time': 'Part-time',
      'Part-time': 'Part-time',
      'Part Time': 'Part-time',
      'internship': 'Internship',
      'Internship': 'Internship'
    };
    return map[type] || type;
  };
  const filteredJobs = jobs.filter(job => {
    // Search filter
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      (job.job_designation && job.job_designation.toLowerCase().includes(q)) ||
      (job.company_name && job.company_name.toLowerCase().includes(q)) ||
      (Array.isArray(job.skills_required)
        ? job.skills_required.some(skill => skill.toLowerCase().includes(q))
        : job.skills_required && job.skills_required.toLowerCase().includes(q));
    // Job type filter (normalize both sides)
    const matchesType =
      jobType === 'all' || (job.job_type && normalizeJobType(job.job_type) === normalizeJobType(jobType));
    // Location filter
    const matchesLocation =
      !location || (job.job_location && job.job_location.toLowerCase().includes(location.toLowerCase()));
    // Category filter (case and value match)
    const matchesCategory =
      category === 'all' || (job.job_category && job.job_category === category);
    return matchesSearch && matchesType && matchesLocation && matchesCategory;
  });

  return (
    <div className="jobs-bg min-h-screen py-10 px-2 md:px-8 flex flex-col items-center">
      {/* Search bar with integrated filter icon */}
      <div className="w-full max-w-7xl mb-6 animate-fade-slide-in flex items-center justify-center" style={{animationDelay: '0.1s'}}>
        <AnimatedSearchBar 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          onFilterClick={() => setShowMobileFilters(true)}
        />
      </div>
      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <MobileFilterDrawer>
          <div style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 32,
            paddingBottom: 16,
            borderBottom: '2px solid #e9ecef'
          }}>
            <h2 style={{
              margin: 0, 
              fontSize: '28px',
              fontWeight: '700',
              color: '#2c3e50',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>Filters</h2>
            <button 
              onClick={() => setShowMobileFilters(false)}
              style={{
                background: '#dc3545',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#fff',
                padding: '12px',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                fontWeight: 'bold',
                lineHeight: '1'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.background = '#c82333';
                e.target.style.boxShadow = '0 6px 16px rgba(220, 53, 69, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = '#dc3545';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
              }}
            >
              ×
            </button>
          </div>
          <div style={{flex: 1, overflowY: 'auto'}}>
            <div className="filter-group" style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #f1f3f4'
            }}>
              <h3 style={{
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                marginTop: '0'
              }}>Job Type</h3>
              <select value={jobType} onChange={e => setJobType(e.target.value)} style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#fff',
                color: '#2c3e50',
                transition: 'all 0.3s ease',
                outline: 'none'
              }} onFocus={(e) => e.target.style.borderColor = '#007bff'}>
                <option value="all">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="filter-group" style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #f1f3f4'
            }}>
              <h3 style={{
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                marginTop: '0'
              }}>Location</h3>
              <input 
                type="text" 
                placeholder="e.g. Delhi, Mumbai, Remote" 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#fff',
                  color: '#2c3e50',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
              />
            </div>
            <div className="filter-group" style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #f1f3f4'
            }}>
              <h3 style={{
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                marginTop: '0'
              }}>Category</h3>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#fff',
                color: '#2c3e50',
                transition: 'all 0.3s ease',
                outline: 'none'
              }} onFocus={(e) => e.target.style.borderColor = '#007bff'}>
                <option value="all">All Categories</option>
                {JOB_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button style={{
            marginTop: 24, 
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: '#fff', 
            border: 'none', 
            borderRadius: '16px', 
            padding: '16px 0', 
            fontWeight: '700', 
            fontSize: '18px', 
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(0, 123, 255, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }} 
          onClick={() => setShowMobileFilters(false)}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.3)';
          }}
          >
            Apply Filters
          </button>
        </MobileFilterDrawer>
      )}
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-10 relative z-10">
        {/* Sidebar Filters (desktop only, now on the left) */}
        <aside className="filters-container animate-fade-slide-in order-1 md:order-1 hidden md:block">
          <h2>Filters</h2>
          <div className="filter-group">
            <h3>Job Type</h3>
            <select value={jobType} onChange={e => setJobType(e.target.value)}>
              <option value="all">All</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="filter-group">
            <h3>Location</h3>
            <input type="text" placeholder="e.g. Delhi" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div className="filter-group">
            <h3>Category</h3>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="all">All</option>
              {JOB_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </aside>
        <main className="flex-1 order-2 md:order-2">
          <h2 className="jobs-heading mb-8 animate-shine-underline">Available Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              // Show skeleton loading
              [...Array(6)].map((_, idx) => (
                <div key={idx} className="animate-jobcard-fade" style={{animationDelay: `${0.12 + idx * 0.08}s`}}>
                  <JobCardSkeleton />
                </div>
              ))
            ) : filteredJobs.length === 0 ? (
              <p className="col-span-3 text-center text-gray-500">No jobs found.</p>
            ) : (
              filteredJobs.map((job, idx) => (
              <div key={job._id} className="animate-jobcard-fade" style={{animationDelay: `${0.12 + idx * 0.08}s`}}>
                <JobCard
                  job={job}
                  onApply={user?.role === 'user' ? () => {/* handle apply */} : undefined}
                />
              </div>
              ))
            )}
          </div>
        </main>
      </div>
      {/* Animated background shapes */}
      <div className="jobs-bg-shape1" />
      <div className="jobs-bg-shape2" />
      <style>{`
        .jobs-bg {
          background:
            radial-gradient(circle at 10% 20%, #60a5fa55 0%, #23272f00 60%),
            radial-gradient(circle at 90% 80%, #eaf4ff88 0%, #23272f00 60%),
            radial-gradient(circle at 40% 60%, #dbe9ff88 0%, #23272f00 60%),
            radial-gradient(circle at 80% 10%, #f9fbfd88 0%, #23272f00 60%),
            #23272f;
          background-size: 400% 400%;
          animation: jobsBgAnimation 15s ease infinite;
          position: relative;
        }
        @keyframes jobsBgAnimation {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .jobs-bg-shape1 {
          position: absolute;
          top: -120px;
          left: -120px;
          width: 340px;
          height: 340px;
          background: radial-gradient(circle at 40% 60%, #e0e7ff33 0%, #fff0 100%);
          border-radius: 50%;
          filter: blur(32px);
          z-index: 0;
        }
        .jobs-bg-shape2 {
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle at 60% 40%, #e0e7ff22 0%, #fff0 100%);
          border-radius: 50%;
          filter: blur(28px);
          z-index: 0;
        }
        .filters-container {
          background-color: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2), 0 8px 30px rgba(0, 0, 0, 0.1);
          padding: 30px;
          max-width: 320px;
          width: 100%;
          box-sizing: border-box;
          display: none;
        }
        @media (min-width: 768px) {
          .filters-container {
            display: block;
          }
        }
        .filters-container h2 {
          color: #ffffff;
          text-shadow: 0 0 10px rgba(0, 123, 255, 0.8), 0 0 20px rgba(0, 123, 255, 0.4);
          font-weight: 800;
          font-size: 2.1em;
          margin-top: 0;
          margin-bottom: 28px;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .filters-container h3 {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 700;
          font-size: 1.15em;
          margin-bottom: 12px;
          margin-top: 25px;
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
        .filters-container select,
        .filters-container input[type="text"] {
          background-color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 12px;
          color: #212529;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 1em;
          font-weight: 500;
          transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292%22%20height%3D%22292%22%3E%3Cpath%20fill%3D%22%23212529%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-5.4H18.2c-7.9%200-14.3%206.4-14.3%2014.3v42.4c0%207.9%206.4%2014.3%2014.3%2014.3h255.6c7.9%200%2014.3-6.4%2014.3-14.3V82.6c.1-4.7-1.7-9.3-5.3-12.7z%22%2F%3E%3C%2Fsvg%3E');
          background-repeat: no-repeat;
          background-position: right 12px top 50%;
          background-size: 12px auto;
          text-shadow: 0 0 0.5px rgba(0, 0, 0, 0.1);
        }
        .filters-container select::placeholder,
        .filters-container input[type="text"]::placeholder {
          color: rgba(0, 0, 0, 0.45);
          font-weight: 400;
        }
        .filters-container select:focus,
        .filters-container input[type="text"]:focus {
          background-color: rgba(255, 255, 255, 0.95);
          border-color: #007bff;
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
          outline: none;
        }
        .filter-group {
          margin-bottom: 25px;
          width: 100%;
        }
        .filter-group:last-child {
          margin-bottom: 0;
        }
        .jobs-heading {
          font-size: 2.1rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: 0.01em;
          position: relative;
          display: inline-block;
          overflow: hidden;
        }
        .animate-shine-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -7px;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.7s cubic-bezier(.4,0,.2,1);
          animation: underline-in 0.8s cubic-bezier(.4,0,.2,1) 0.3s forwards;
        }
        @keyframes underline-in {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-fade-slide-in {
          animation: fade-slide-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fade-slide-in {
          0% { opacity: 0; transform: translateY(18px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-jobcard-fade {
          animation: jobcard-fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes jobcard-fade-in {
          0% { opacity: 0; transform: translateY(24px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Jobs; 