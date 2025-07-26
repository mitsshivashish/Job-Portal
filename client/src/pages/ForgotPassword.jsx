import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden px-4">
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-blue-200 via-blue-400 to-transparent rounded-full blur-3xl opacity-40 animate-pulse-slow -top-32 -left-32 z-0" />
      <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-300 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow -bottom-24 right-0 z-0" />
      <div className="w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 animate-fade-in-up">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-blue-700 mb-2 tracking-tight">Forgot Password</h2>
          <p className="text-center text-sm text-blue-500 mb-6 sm:mb-8">Enter your email to receive a password reset link.</p>
          {submitted ? (
            <div className="text-center text-green-600 font-semibold">
              If an account with that email exists, a reset link has been sent.
              <div className="mt-6">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 underline-animated">Back to Login</Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} autoComplete="off">
              <div className="relative animate-input-in">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="peer glass-input modern-animated-input animated-placeholder"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-full font-bold bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 text-white text-base sm:text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 underline-animated">Back to Login</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 