import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchJobs, fetchFeaturedJobs, fetchRecommendedJobs } from '../api/jobs';
import JobCard from '../components/JobCard';
import AnimatedSearchBar from '../components/AnimatedSearchBar';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Smart Job Search',
    desc: 'Find jobs that match your skills and experience with our intelligent search and filtering system.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    title: 'Easy Application',
    desc: 'Apply to jobs with just a few clicks. Upload your resume and track your applications easily.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Recruiter Tools',
    desc: 'Post jobs, manage applications, and find the perfect candidates for your organization.'
  }
];

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then(res => {
      setJobs(res.data.data);
      setFiltered(res.data.data.slice(0, 6));
    });
      fetchFeaturedJobs().then(res => {
        setFeaturedJobs(res.data.data || []);
      });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(jobs.slice(0, 6));
    } else {
      const s = search.trim().toLowerCase();
      setFiltered(
        jobs.filter(job =>
          job.job_designation?.toLowerCase().includes(s) ||
          job.company_name?.toLowerCase().includes(s) ||
          job.job_location?.toLowerCase().includes(s) ||
          job.job_category?.toLowerCase().includes(s) ||
          job.job_type?.toLowerCase().includes(s) ||
          (Array.isArray(job.skills_required)
            ? job.skills_required.join(',').toLowerCase().includes(s)
            : job.skills_required?.toLowerCase().includes(s))
        )
      );
    }
  }, [search, jobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Animated Search Bar at the very top for full animation visibility */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem', marginBottom: '2rem' }}>
        <AnimatedSearchBar value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {/* Hero Section - only show when not searching */}
      {(!search.trim()) && (
        <section className="text-center py-8 sm:py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-96 h-96 bg-gradient-to-tr from-blue-200 via-pink-100 to-transparent rounded-full blur-3xl opacity-60 animate-pulse-slow absolute -top-32 -left-32" />
            <div className="w-80 h-80 bg-gradient-to-br from-pink-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-50 animate-pulse-slow absolute -bottom-24 right-0" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 relative z-10 px-4">
            Find Your <span className="bg-gradient-to-r from-blue-500 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">Dream Job</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto relative z-10 px-4">
            Connect with top employers and discover opportunities that match your skills and aspirations. Whether you're looking for your next career move or posting job opportunities, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 px-4">
            <Link to="/jobs" className="text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full font-bold bg-gradient-to-r from-blue-500 to-pink-400 shadow-lg hover:from-blue-600 hover:to-pink-500 transition-all duration-300 text-white">
              Browse Jobs
            </Link>
              <Link to="/post-job" className="text-base sm:text-lg px-6 sm:px-8 py-3 rounded-full font-bold bg-white border-2 border-blue-400 text-blue-600 shadow hover:bg-blue-50 transition-all duration-300">
                Post a Job
              </Link>
          </div>
        </section>
      )}
      {/* Featured/Search Results Section */}
      <section className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center px-4">
          {search.trim() ? 'Searched Jobs' : 'Featured Jobs'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {search.trim()
            ? (
              filtered.length === 0
                ? <p className="col-span-full text-center text-gray-500 px-4">No jobs found for your search.</p>
                : filtered.map((job, idx) => (
                    <div key={job._id} style={{ animation: `fadeInUp 0.5s ${idx * 0.1 + 0.2}s both` }}>
                      <JobCard job={job} />
                    </div>
                  ))
            )
            : (
              featuredJobs.length === 0
                ? <p className="col-span-full text-center text-gray-500 px-4">No featured jobs found.</p>
                : featuredJobs.map((job, idx) => (
              <div key={job._id} style={{ animation: `fadeInUp 0.5s ${idx * 0.1 + 0.2}s both` }}>
                <JobCard job={job} />
              </div>
            ))
            )
          }
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 py-8 sm:py-16 px-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="text-center bg-gradient-to-br from-white via-blue-50 to-pink-50 rounded-2xl shadow-lg p-6 sm:p-8 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ animation: `fadeInUp 0.5s ${i * 0.1 + 0.2}s both` }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-200 via-pink-200 to-blue-100 animate-pulse-slow">
              {f.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="rounded-lg p-6 sm:p-8 text-center text-white mb-8 sm:mb-16 bg-gradient-to-r from-blue-500 via-pink-400 to-blue-400 shadow-xl mx-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 mb-6 text-sm sm:text-base">
          Join thousands of job seekers and employers who trust our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-full transition-all duration-300 shadow">
            Create Account
          </Link>
          <Link to="/jobs" className="border border-white text-white hover:bg-white hover:text-blue-600 font-medium py-2 px-6 rounded-full transition-all duration-300 shadow">
            Browse Jobs
          </Link>
        </div>
      </section>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Home; 