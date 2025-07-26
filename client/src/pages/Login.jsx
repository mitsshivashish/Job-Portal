import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password, formData.role);
      if (success) {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden px-4">
      {/* Animated floating shapes */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-blue-200 via-blue-400 to-transparent rounded-full blur-3xl opacity-40 animate-pulse-slow -top-32 -left-32 z-0" />
      <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-300 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow -bottom-24 right-0 z-0" />
      <div className="w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 animate-fade-in-up">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-blue-700 mb-2 tracking-tight shining-text animate-fade-in-up">Sign in to your account</h2>
          <p className="text-center text-sm text-blue-500 mb-6 sm:mb-8 animate-fade-in-delayed">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800 transition-colors underline-animated">
              create a new account
            </Link>
          </p>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative animate-input-in">
                <AnimatedPlaceholder
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`peer glass-input modern-animated-input animated-placeholder ${errors.email ? 'border-red-500' : ''}`}
                  text="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="relative animate-input-in" style={{ animationDelay: '0.1s' }}>
                <AnimatedPlaceholder
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`peer glass-input modern-animated-input animated-placeholder ${errors.password ? 'border-red-500' : ''}`}
                  text="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="text-right animate-fade-in-delayed" style={{ animationDelay: '0.15s' }}>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors underline-animated">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full font-bold bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 text-white text-base sm:text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-delayed"
              style={{ animationDelay: '0.2s' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
            <div className="text-center mt-4 animate-fade-in-delayed" style={{ animationDelay: '0.3s' }}>
              <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors underline-animated">
                Back to home
              </Link>
            </div>
          </form>
          <div className="flex flex-col items-center mt-6">
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
              className="w-full py-3 px-4 rounded-full font-bold bg-white border-2 border-blue-500 text-blue-700 shadow hover:bg-blue-50 transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2"
              style={{ marginTop: 8 }}
            >
              <svg width="22" height="22" viewBox="0 0 48 48" className="mr-2" style={{ display: 'inline-block', verticalAlign: 'middle' }}><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.972 32.833 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.69 0 5.164.896 7.163 2.385l6.084-6.084C33.527 5.345 28.97 3.5 24 3.5 12.849 3.5 3.5 12.849 3.5 24S12.849 44.5 24 44.5c10.93 0 20.5-8.5 20.5-20.5 0-1.364-.138-2.697-.389-3.917z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.008 13.5 24 13.5c2.69 0 5.164.896 7.163 2.385l6.084-6.084C33.527 5.345 28.97 3.5 24 3.5c-6.627 0-12 5.373-12 12 0 1.885.435 3.669 1.306 5.191z"/><path fill="#FBBC05" d="M24 44.5c5.318 0 10.13-1.824 13.885-4.958l-6.415-5.26C29.418 36 24.972 37.5 24 37.5c-5.408 0-9.96-3.155-11.303-7.917l-6.571 5.081C7.849 41.155 15.527 44.5 24 44.5z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303C34.418 32.833 29.972 36 24 36c-5.408 0-9.96-3.155-11.303-7.917l-6.571 5.081C7.849 41.155 15.527 44.5 24 44.5c5.318 0 10.13-1.824 13.885-4.958l-6.415-5.26C29.418 36 24.972 37.5 24 37.5c-5.408 0-9.96-3.155-11.303-7.917l-6.571 5.081C7.849 41.155 15.527 44.5 24 44.5z"/></g></svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .glass-input {
          background: rgba(255,255,255,0.7);
          border: 2px solid #e0e7ef;
          border-radius: 12px;
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
          background: rgba(224,242,254,0.9);
          color: #1e40af;
        }
        .glass-input:hover {
          border-color: #60a5fa;
          background: rgba(224,242,254,0.6);
        }
        .modern-animated-input {
          transition: border 0.3s, box-shadow 0.3s, background 0.3s, color 0.3s;
        }
        .animated-placeholder-span {
          position: absolute;
          left: 1.2rem;
          top: 1.1rem;
          color: #60a5fa;
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
          0% { opacity: 0; color: #2563eb; }
          100% { opacity: 1; color: #60a5fa; }
        }
        .glass-label {
          position: absolute;
          left: 1.2rem;
          top: 1.1rem;
          color: #64748b;
          font-size: 1.1rem;
          pointer-events: none;
          background: transparent;
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }
        .glass-input:focus + .glass-label,
        .glass-input:not(:placeholder-shown) + .glass-label {
          top: -0.7rem;
          left: 1rem;
          font-size: 0.95rem;
          color: #2563eb;
          background: #fff;
          padding: 0 0.3rem;
          border-radius: 6px;
          animation: label-pop 0.4s cubic-bezier(.4,0,.2,1);
        }
        .animated-label {
          will-change: transform, color;
        }
        @keyframes label-pop {
          0% { transform: scale(0.95); color: #60a5fa; }
          100% { transform: scale(1); color: #2563eb; }
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
        .animate-fade-in-delayed[style*='0.1s'] { animation-delay: 0.1s; }
        .animate-fade-in-delayed[style*='0.2s'] { animation-delay: 0.2s; }
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

export default Login; 