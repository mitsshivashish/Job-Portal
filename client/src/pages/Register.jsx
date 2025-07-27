import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthFormSkeleton from '../components/loaders/AuthFormSkeleton';
import axios from 'axios';

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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    adminCode: ''
  });
  const [companyDetails, setCompanyDetails] = useState(null);
  const [checkingCode, setCheckingCode] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'adminCode' ? value.replace(/[^0-9]/g, '') : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const checkAdminCode = async (code) => {
    if (code.length === 14) {
      setCheckingCode(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/companies/admin-code/${code}`);
        if (response.data.success) {
          setCompanyDetails(response.data.data);
        }
      } catch (error) {
        setCompanyDetails(null);
      } finally {
        setCheckingCode(false);
      }
    } else {
      setCompanyDetails(null);
    }
  };

  const handleAdminCodeChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      adminCode: numericValue
    }));
    
    if (numericValue.length === 14) {
      checkAdminCode(numericValue);
    } else {
      setCompanyDetails(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Call backend directly for registration to get OTP flow
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      };
      if (formData.adminCode && formData.adminCode.length === 14) {
        payload.adminCode = Number(formData.adminCode);
      }
      const res = await axios.post('/api/auth/register', payload);
      setRegisteredEmail(formData.email);
      setShowOtpInput(true);
    } catch (error) {
      setErrors({
        ...errors,
        api: error.response?.data?.message || 'Registration failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await axios.post('/api/auth/verify-otp', {
        email: registeredEmail,
        otp
      });
      setOtpSuccess('Account verified! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setOtpError(error.response?.data?.message || 'OTP verification failed.');
    }
  };

  if (pageLoading) {
    return <AuthFormSkeleton />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 relative overflow-hidden px-4">
      {/* Subtle blue accent shape */}
      <div className="absolute w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -top-32 -left-32 z-0" />
      <div className="w-full max-w-lg z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-xl p-6 sm:p-12 animate-fade-in-up">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-blue-800 mb-2 tracking-tight animate-slide-in shining-text">
            {showOtpInput ? 'Verify Your Email' : 'Create your account'}
          </h2>
          <p className="text-center text-sm text-blue-500 mb-6 sm:mb-8 animate-fade-in-delayed">
            {showOtpInput ? (
              <>Enter the OTP sent to <b>{registeredEmail}</b></>
            ) : (
              <>
                Or{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition-colors underline-animated">
                  sign in to your existing account
                </Link>
                {' '}•{' '}
                <Link to="/portal-admin-login" className="font-medium text-green-600 hover:text-green-800 transition-colors underline-animated">
                  portal admin login
                </Link>
              </>
            )}
          </p>
          {!showOtpInput ? (
            <form className="space-y-5 sm:space-y-7" onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-4 sm:space-y-6">
                <div className="relative animate-input-in">
                  <AnimatedPlaceholder
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className={`peer glass-input modern-animated-input animated-placeholder ${errors.name ? 'border-blue-500' : ''}`}
                    text="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="mt-1 text-sm text-blue-600 animate-error-in">{errors.name}</p>}
                </div>
                <div className="relative animate-input-in" style={{ animationDelay: '0.05s' }}>
                  <AnimatedPlaceholder
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`peer glass-input modern-animated-input animated-placeholder ${errors.email ? 'border-blue-500' : ''}`}
                    text="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="mt-1 text-sm text-blue-600 animate-error-in">{errors.email}</p>}
                </div>
                <div className="relative animate-input-in" style={{ animationDelay: '0.1s' }}>
                  <AnimatedPlaceholder
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`peer glass-input modern-animated-input animated-placeholder ${errors.password ? 'border-blue-500' : ''}`}
                    text="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="mt-1 text-sm text-blue-600 animate-error-in">{errors.password}</p>}
                </div>
                <div className="relative animate-input-in" style={{ animationDelay: '0.15s' }}>
                  <AnimatedPlaceholder
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`peer glass-input modern-animated-input animated-placeholder ${errors.confirmPassword ? 'border-blue-500' : ''}`}
                    text="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-blue-600 animate-error-in">{errors.confirmPassword}</p>}
                </div>
                <div className="relative animate-input-in" style={{ animationDelay: '0.18s' }}>
                  <AnimatedPlaceholder
                    id="phone"
                    name="phone"
                    type="text"
                    autoComplete="tel"
                    required
                    className={`peer glass-input modern-animated-input animated-placeholder ${errors.phone ? 'border-blue-500' : ''}`}
                    text="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-blue-600 animate-error-in">{errors.phone}</p>}
                </div>
                <div className="relative animate-input-in" style={{ animationDelay: '0.2s' }}>
                  <AnimatedPlaceholder
                    id="adminCode"
                    name="adminCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={14}
                    className={`peer glass-input modern-animated-input animated-placeholder ${errors.adminCode ? 'border-blue-500' : ''}`}
                    text="Admin Registration Code (optional)"
                    value={formData.adminCode}
                    onChange={handleAdminCodeChange}
                  />
                  {errors.adminCode && <p className="mt-1 text-sm text-blue-600 animate-error-in">{errors.adminCode}</p>}
                  
                  {checkingCode && (
                    <p className="mt-1 text-sm text-blue-600">Checking code...</p>
                  )}
                  
                  {companyDetails && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">Company Found:</p>
                      <p className="text-sm text-green-700">{companyDetails.name}</p>
                      <p className="text-sm text-green-700">{companyDetails.location}</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.api && <p className="text-center text-red-500 mb-2">{errors.api}</p>}
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold shadow hover:from-blue-600 hover:to-pink-500 transition-all duration-300 text-base sm:text-lg mt-4"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          ) : (
            <form className="space-y-5 sm:space-y-7" onSubmit={handleOtpSubmit} autoComplete="off">
              <div className="space-y-4 sm:space-y-6">
                <div className="relative animate-input-in">
                  <AnimatedPlaceholder
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className={`peer glass-input modern-animated-input animated-placeholder`}
                    text="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                  />
                </div>
                {otpError && <p className="text-center text-red-500 mb-2">{otpError}</p>}
                {otpSuccess && <p className="text-center text-green-600 mb-2">{otpSuccess}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold shadow hover:from-blue-600 hover:to-pink-500 transition-all duration-300 text-base sm:text-lg mt-4"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        .glass-input {
          background: rgba(255,255,255,0.7);
          border: 2px solid #e0e7ef;
          border-radius: 14px;
          padding: 1.1rem 1.2rem 1.1rem 1.2rem;
          width: 100%;
          font-size: 1.1rem;
          color: #1e293b;
          outline: none;
          transition: border 0.3s, box-shadow 0.3s, background 0.3s, color 0.3s;
        }
        .glass-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #2563eb33, 0 4px 24px 0 #2563eb22;
          background: rgba(226, 232, 240, 0.9);
          color: #1d4ed8;
        }
        .glass-input:hover {
          border-color: #60a5fa;
          background: rgba(226, 232, 240, 0.6);
        }
        .modern-animated-input {
          transition: border 0.3s, box-shadow 0.3s, background 0.3s, color 0.3s;
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
        @keyframes error-in {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-error-in {
          animation: error-in 0.4s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-delayed[style*='0.05s'] { animation-delay: 0.05s; }
        .animate-fade-in-delayed[style*='0.1s'] { animation-delay: 0.1s; }
        .animate-fade-in-delayed[style*='0.15s'] { animation-delay: 0.15s; }
        .animate-fade-in-delayed[style*='0.18s'] { animation-delay: 0.18s; }
        .animate-fade-in-delayed[style*='0.2s'] { animation-delay: 0.2s; }
        .animate-fade-in-delayed[style*='0.25s'] { animation-delay: 0.25s; }
        .animate-fade-in-delayed[style*='0.3s'] { animation-delay: 0.3s; }
        @keyframes input-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-input-in {
          animation: input-in 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .underline-animated {
          position: relative;
          display: inline-block;
        }
        .underline-animated:after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -2px;
          height: 2px;
          background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.3s;
        }
        .underline-animated:hover:after {
          transform: scaleX(1);
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-slide-in {
          animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .shining-text {
          position: relative;
          background: linear-gradient(90deg, #2563eb 20%, #60a5fa 40%, #fff 50%, #60a5fa 60%, #2563eb 80%);
          background-size: 200% auto;
          color: #2563eb;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine-move 2.5s linear 3s infinite both;
        }
        @keyframes shine-move {
          0% {
            background-position: 200% center;
          }
          60% {
            background-position: -200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default Register; 