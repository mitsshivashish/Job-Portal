import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 max-w-md w-full text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4">Invalid Link</h2>
          <p className="text-blue-500 mb-6">The password reset link is invalid or incomplete.</p>
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 underline-animated">Request a new link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 max-w-md w-full">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-blue-700 mb-2 tracking-tight">Reset Password</h2>
        <p className="text-center text-sm text-blue-500 mb-6 sm:mb-8">Enter your new password below.</p>
        {success ? (
          <div className="text-center text-green-600 font-semibold">
            Your password has been reset successfully.<br />
            <Link to="/login" className="text-blue-600 hover:text-blue-800 underline-animated mt-4 inline-block">Back to Login</Link>
          </div>
        ) : (
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="relative animate-input-in">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="peer glass-input modern-animated-input animated-placeholder"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="relative animate-input-in">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="peer glass-input modern-animated-input animated-placeholder"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full font-bold bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 text-white text-base sm:text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 