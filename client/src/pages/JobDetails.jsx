import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';
import { fetchJob, applyForJob } from '../api/jobs';
import { FaBookmark, FaRegBookmark, FaGlobe, FaLinkedin, FaMoneyBillWave, FaCalendarAlt, FaClock, FaBriefcase, FaTag, FaBolt, FaUser, FaEnvelope, FaUpload, FaPaperPlane, FaPhone } from 'react-icons/fa';

const MAX_DESC_LENGTH = 300;

const TYPING_SPEED = 40;

const AnimatedPlaceholder = ({ text, value, onChange, ...props }) => {
  const [displayed, setDisplayed] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (!value && !isFocused) {
      setDisplayed('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, TYPING_SPEED);
      return () => clearInterval(interval);
    } else {
      setDisplayed('');
    }
  }, [text, value, isFocused]);
  return (
    <div className="relative w-full">
      <input
        {...props}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={props.className}
        autoComplete={props.autoComplete}
      />
      {(!value && !isFocused && displayed) && (
        <span className="animated-placeholder-span pointer-events-none select-none">
          {displayed}
        </span>
      )}
    </div>
  );
};

const DEFAULT_LOGO = '/logo.svg'; // Use your default logo path in public/

const JobDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantContact, setApplicantContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJob(id).then(res => setJob(res.data.data));
  }, [id]);

  if (!job) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Helper: get company website or LinkedIn
  const companyLinks = [
    job.company_website && { url: job.company_website, icon: <FaGlobe />, label: 'Website' },
    job.company_linkedin && { url: job.company_linkedin, icon: <FaLinkedin />, label: 'LinkedIn' }
  ].filter(Boolean);

  // Helper: info grid
  const infoGrid = [
    { icon: <FaMoneyBillWave className="text-blue-400" />, label: 'Salary', value: job.salary },
    { icon: <FaBriefcase className="text-blue-400" />, label: 'Type', value: job.job_type || 'Full Time' },
    { icon: <FaCalendarAlt className="text-blue-400" />, label: 'Posted', value: (job.posted_at || job.createdAt) ? new Date(job.posted_at || job.createdAt).toLocaleDateString() : 'N/A' },
    { icon: <FaClock className="text-blue-400" />, label: 'Apply by', value: job.apply_by ? new Date(job.apply_by).toLocaleDateString() : 'N/A' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-blue-700 relative overflow-hidden">
      {/* Back to Jobs link */}
      <div className="absolute left-0 top-0 p-6 z-20">
        <Link
          to={location.state?.fromMyPostedJobs ? '/my-posted-jobs' : '/jobs'}
          className="text-blue-500 hover:text-blue-700 font-semibold text-lg transition-colors"
        >
           Back to Jobs
        </Link>
      </div>
      {/* Subtle animated accent */}
      <div className="absolute w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-30 -top-32 -right-32 animate-pulse-slow z-0" />
      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 z-10">
        <div className="relative bg-white/90 rounded-2xl shadow-2xl border border-blue-200 p-6 sm:p-10 animate-fade-in-up overflow-hidden premium-card">
          {/* Company logo watermark */}
          <div className="absolute right-4 sm:right-6 top-4 sm:top-6 opacity-10 pointer-events-none select-none" style={{fontSize: '4rem', zIndex: 0}}>
            {job.company_logo ? <img src={job.company_logo} alt="logo" className="w-16 h-16 sm:w-28 sm:h-28 object-contain" /> : <img src={DEFAULT_LOGO} alt="logo" className="w-16 h-16 sm:w-28 sm:h-28 object-contain" />}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center mb-6 relative z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/60 shadow-lg flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 border-2 border-blue-300 glassy-logo relative self-center sm:self-auto">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt="Company Logo"
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain rounded-full"
                  style={{ background: '#f4f6fa', border: '1px solid #eee' }}
                />
              ) : (
                <span style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #6a82fb, #fc5c7d)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)',
                  border: '1px solid #eee'
                }}>
                  {job.company_name ? job.company_name[0].toUpperCase() : 'C'}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-900 animated-underline inline-block">{job.job_designation}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {job.featured && <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 text-xs font-bold text-yellow-900 shadow animate-bounce-slow">Featured</span>}
                  {/* Admin Edit Button */}
                  {user?.role === 'admin' && (
                    <button
                      className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all text-sm"
                      onClick={() => navigate('/post-job', { state: { editMode: true, job } })}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <p className="text-gray-700 font-medium">{job.company_name}</p>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  {companyLinks.map(link => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label} className="text-blue-400 hover:text-blue-600 text-lg align-middle">{link.icon}</a>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm mt-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.job_location}
              </div>
            </div>
          </div>
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 border-b border-blue-100 pb-4">
            {infoGrid.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                {item.icon}
                <span className="font-medium">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          {/* Tags/Skills */}
          <div className="mb-4 flex flex-wrap gap-2 items-center justify-center sm:justify-start">
            <span className="category-badge" title="Job Category" aria-label="Job Category">
              <FaTag className="inline-block mr-1 text-blue-400 -mt-0.5" />
              <span className="font-semibold text-blue-700">{job.job_category}</span>
            </span>
            <span className="h-5 w-px bg-blue-100 mx-2 inline-block align-middle"></span>
            {Array.isArray(job.skills_required)
              ? job.skills_required.slice(0, 6).map((skill, idx) => (
                  <span key={idx} className="skill-badge animate-tag-in" style={{animationDelay: `${0.1 + idx * 0.07}s`}} title="Required Skill">
                    <FaBolt className="inline-block mr-1 text-sky-300 animate-bounce-slow" />
                    {skill}
                  </span>
                ))
              : job.skills_required && (
                  <span className="skill-badge animate-tag-in" title="Required Skill">
                    <FaBolt className="inline-block mr-1 text-sky-300 animate-bounce-slow" />
                    {job.skills_required}
                  </span>
                )}
          </div>
          {/* Description with Read More */}
          <div className="mb-6 relative">
            <h2 className="text-lg font-semibold mb-2">Job Description</h2>
            <div className="relative">
              <p className={`text-gray-700 whitespace-pre-line transition-all duration-300 ${!descExpanded && job.description.length > MAX_DESC_LENGTH ? 'desc-fade' : ''}`}>{descExpanded || job.description.length <= MAX_DESC_LENGTH ? job.description : job.description.slice(0, MAX_DESC_LENGTH) + '...'}</p>
              {job.description.length > MAX_DESC_LENGTH && (
                <button className="absolute right-0 bottom-0 text-blue-500 bg-white/80 px-2 py-1 rounded shadow hover:bg-blue-100 transition-all text-xs font-semibold" onClick={() => setDescExpanded(v => !v)}>
                  {descExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
              {!descExpanded && job.description.length > MAX_DESC_LENGTH && <div className="desc-fadeout" />}
            </div>
          </div>
          {/* Apply/Bookmark */}
          {user?.role === 'user' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg text-white text-base sm:text-lg transition-all duration-300 hover:scale-105 focus:outline-none ripple-effect flex items-center justify-center gap-2"
                onClick={() => setShowApply(true)}
              >
                Apply Now
              </button>
              <button
                className="text-blue-400 hover:text-blue-700 text-2xl transition-colors"
                onClick={() => setBookmarked(b => !b)}
                title={bookmarked ? 'Remove Bookmark' : 'Bookmark Job'}
              >
                {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
          )}
          {/* Animated SVG wave at card bottom */}
          <svg className="absolute left-0 bottom-0 w-full h-10 opacity-30 z-0" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="url(#wave-gradient)" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Apply Modal/Section */}
        {showApply && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in-up p-4">
            <div className="bg-white/80 rounded-2xl shadow-2xl border border-blue-200 p-6 sm:p-8 w-full max-w-md relative backdrop-blur-xl animate-fade-in-up premium-modal overflow-hidden">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowApply(false)}
              >
                &times;
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-800 animated-underline">Apply for {job.job_designation}</h2>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setSubmitting(true);
                  let resumePath = '';
                  if (uploadedFile) {
                    // Upload file to server (implement actual upload logic if needed)
                    const formData = new FormData();
                    formData.append('file', uploadedFile);
                    try {
                      const res = await fetch('http://localhost:5000/api/applications/upload', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                      });
                      const data = await res.json();
                      resumePath = data.path || uploadedFile.name;
                    } catch (err) {
                      toast.error('Resume upload failed');
                      setSubmitting(false);
                      return;
                    }
                  }
                  // Debug log for application data
                  console.log('Submitting application:', {
                    jobId: job._id,
                    name: applicantName,
                    email: applicantEmail,
                    contact: applicantContact,
                    resumePath
                  });
                  try {
                    const response = await applyForJob(job._id, {
                      name: applicantName,
                      email: applicantEmail,
                      contact: applicantContact,
                      resumePath
                    });
                    toast.success('Application submitted!');
                    if (response.data && response.data.job) {
                      setJob(response.data.job);
                    }
                    setShowApply(false);
                    setUploadedFile(null);
                    setApplicantName('');
                    setApplicantEmail('');
                    setApplicantContact('');
                  } catch (err) {
                    // Show backend error message if available
                    if (err.response && err.response.data && err.response.data.message) {
                      toast.error(err.response.data.message);
                    } else {
                      toast.error('Failed to submit application');
                    }
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="space-y-5">
                  <div className="relative animate-input-in">
                    <FaUser className="input-icon" />
                    <input type="text" className="premium-input" placeholder="Your Name" required value={applicantName} onChange={e => setApplicantName(e.target.value)} />
                  </div>
                  <div className="relative animate-input-in" style={{animationDelay: '0.1s'}}>
                    <FaEnvelope className="input-icon" />
                    <input type="email" className="premium-input" placeholder="Your Email" required value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} />
                  </div>
                  <div className="relative animate-input-in" style={{animationDelay: '0.15s'}}>
                    <FaPhone className="input-icon" />
                    <input type="text" className="premium-input" placeholder="Your Contact Number" required value={applicantContact} onChange={e => setApplicantContact(e.target.value)} />
                  </div>
                  <div className="relative animate-input-in" style={{animationDelay: '0.2s'}}>
                    <label className="premium-file-label">
                      <FaUpload className="input-icon mr-2" />
                      <span>{uploadedFile ? uploadedFile.name : 'Upload Resume'}</span>
                      <input type="file" className="hidden" onChange={e => setUploadedFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-full font-bold bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg text-white text-lg mt-6 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 focus:outline-none ripple-effect animate-fade-in-delayed" style={{animationDelay: '0.3s'}} disabled={submitting}>
                  <FaPaperPlane className="-ml-1" /> {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <div className="text-xs text-gray-500 text-center mt-4">We respect your privacy. Your data is never shared.</div>
              </form>
              {/* SVG wave accent */}
              <svg className="absolute left-0 bottom-0 w-full h-8 opacity-20 z-0" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="url(#modal-wave-gradient)" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
                <defs>
                  <linearGradient id="modal-wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563eb" />
                    <stop offset="1" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .glassy-logo {
          backdrop-filter: blur(8px);
        }
        .premium-card {
          box-shadow: 0 8px 32px 0 #2563eb22, 0 1.5px 6px 0 #2563eb11;
        }
        .category-badge {
          display: inline-flex;
          align-items: center;
          background: #fff;
          border: 2px solid #2563eb;
          color: #2563eb;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.32rem 0.95rem 0.32rem 0.7rem;
          box-shadow: 0 1px 4px 0 #2563eb11;
          margin-right: 0.2rem;
        }
        .skill-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 1.1rem 0.35rem 0.7rem;
          border-radius: 9999px;
          font-size: 0.97rem;
          font-weight: 500;
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
          color: #fff;
          box-shadow: 0 2px 8px 0 #2563eb22, inset 0 1.5px 8px 0 #fff3;
          backdrop-filter: blur(6px);
          border: none;
          margin-right: 0.1rem;
          margin-bottom: 0.1rem;
          transition: transform 0.18s, box-shadow 0.18s, background 0.3s;
          cursor: default;
          position: relative;
        }
        .skill-badge:hover {
          transform: scale(1.09) translateY(-2px);
          box-shadow: 0 4px 16px 0 #2563eb33, 0 1.5px 8px 0 #fff5;
          background: linear-gradient(90deg, #60a5fa 0%, #2563eb 100%);
        }
        .animate-tag-in {
          animation: tag-in 0.5s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes tag-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animated-underline {
          position: relative;
          display: inline-block;
        }
        .animated-underline:after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -4px;
          height: 3px;
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.5s cubic-bezier(.4,0,.2,1);
          animation: underline-in 0.7s cubic-bezier(.4,0,.2,1) 0.3s forwards;
        }
        @keyframes underline-in {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        .ripple-effect:after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
          background: rgba(96, 165, 250, 0.25);
          border-radius: 100%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: width 0.4s, height 0.4s, opacity 0.4s;
        }
        .ripple-effect:active:after {
          width: 200px;
          height: 200px;
          opacity: 1;
          transition: 0s;
        }
        .desc-fadeout {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 2.5rem;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 90%);
          pointer-events: none;
        }
        .desc-fade {
          max-height: 8.5rem;
          overflow: hidden;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-bounce-slow {
          animation: bounce 1.8s infinite alternate cubic-bezier(.4,0,.2,1);
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        .animated-placeholder-span {
          position: absolute;
          left: 1.2rem;
          top: 1.1rem;
          color: #2563eb;
          opacity: 1;
          font-style: italic;
          font-size: 1.1rem;
          pointer-events: none;
          user-select: none;
          transition: color 0.4s, opacity 0.4s;
          animation: placeholder-fade-in 1.2s cubic-bezier(.4,0,.2,1);
          z-index: 1;
        }
        @keyframes placeholder-fade-in {
          0% { opacity: 0; color: #60a5fa; }
          100% { opacity: 1; color: #2563eb; }
        }
        .animate-input-in {
          animation: input-in 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes input-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .premium-modal {
          box-shadow: 0 8px 32px 0 #2563eb22, 0 1.5px 6px 0 #2563eb11;
        }
        .premium-input {
          width: 100%;
          padding: 1.1rem 1.2rem 1.1rem 2.8rem;
          border-radius: 9999px;
          border: 2px solid #e0e7ef;
          background: rgba(255,255,255,0.7);
          font-size: 1.08rem;
          color: #1e293b;
          outline: none;
          box-shadow: 0 1.5px 8px 0 #2563eb11;
          transition: border 0.3s, box-shadow 0.3s, background 0.3s, color 0.3s;
        }
        .premium-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #2563eb33, 0 4px 24px 0 #2563eb22;
          background: rgba(226, 232, 240, 0.9);
          color: #1d4ed8;
        }
        .premium-input:hover {
          border-color: #60a5fa;
          background: rgba(226, 232, 240, 0.6);
        }
        .input-icon {
          position: absolute;
          left: 1.1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: #2563eb;
          pointer-events: none;
        }
        .premium-file-label {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          padding: 1.1rem 1.2rem 1.1rem 2.8rem;
          border-radius: 9999px;
          border: 2px solid #e0e7ef;
          background: rgba(255,255,255,0.7);
          font-size: 1.08rem;
          color: #1e293b;
          cursor: pointer;
          box-shadow: 0 1.5px 8px 0 #2563eb11;
          transition: border 0.3s, box-shadow 0.3s, background 0.3s, color 0.3s;
        }
        .premium-file-label:hover, .premium-file-label:focus-within {
          border-color: #2563eb;
          background: rgba(226, 232, 240, 0.9);
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default JobDetails; 