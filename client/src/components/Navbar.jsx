import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Lottie from 'lottie-react';
import profileLottie from '../assets/Animation - 1751910490425.json';
import ConfirmModal from './ConfirmModal.jsx';
import NavbarSkeleton from './loaders/NavbarSkeleton';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const portalAdminToken = typeof window !== 'undefined' ? localStorage.getItem('portalAdminToken') : null;
  const isPortalAdmin = Boolean(portalAdminToken);
  const isCompanyRegisterPage = location.pathname === '/company-register';
  const isPortalCompaniesPage = location.pathname === '/portal-companies';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handler for Post Job click
  const handlePostJobClick = (e) => {
    // If already on /post-job and in edit mode, show confirmation
    if (
      location.pathname === '/post-job' &&
      location.state && location.state.editMode
    ) {
      e.preventDefault();
      setPostJobModalOpen(true);
    } else {
      navigate('/post-job');
    }
  };

  if (loading) {
    return <NavbarSkeleton />;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-2xl">J</span>
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">JobPortal</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
          {(isPortalAdmin && (isCompanyRegisterPage || isPortalCompaniesPage)) ? (
            <>
              <NavLink to="/" label="Home" />
              <NavLink to="/portal-companies" label="Registered Companies" />
              <button
                className="nav-underline relative transition-colors duration-200 px-2 py-1 hover:text-blue-600 font-bold"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  localStorage.removeItem('portalAdminToken');
                  localStorage.removeItem('portalAdminData');
                  window.location.href = '/portal-admin-login';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" label="Home" />
              <NavLink to="/jobs" label="Browse Jobs" />
              {user?.role === 'user' && <NavLink to="/my-applications" label="My Applications" />}
              {user?.role === 'admin' && (
                <button
                  className={`nav-underline relative transition-colors duration-200 px-2 py-1 ${location.pathname === '/post-job' ? 'active text-blue-600 font-bold' : 'hover:text-blue-600'}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={handlePostJobClick}
                >
                  Post Job
                </button>
              )}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="w-12 h-12 flex items-center justify-center p-0 bg-transparent border-none shadow-none focus:outline-none"
                    onClick={() => setDropdownOpen((open) => !open)}
                    aria-label="Profile menu"
                    style={{ minWidth: 0, minHeight: 0 }}
                  >
                    <Lottie
                      animationData={profileLottie}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      className="w-full h-full"
                    />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl py-4 z-50 border border-gray-100 transition-all duration-200 ${dropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                    style={{ transformOrigin: 'top right' }}
                  >
                    <Link
                      to="/profile"
                      className="block px-6 py-2 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-semibold"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/my-posted-jobs"
                        className="block px-6 py-2 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-semibold"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Posted Jobs
                      </Link>
                    )}
                    {user?.role === 'user' && (
                      <Link
                        to="/my-applications"
                        className="block px-6 py-2 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors font-semibold"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Applications
                      </Link>
                    )}
                    <button
                      onClick={() => setLogoutModalOpen(true)}
                      className="block w-full text-left px-6 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <NavLink to="/login" label="Login" />
                  <Link to="/register" className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold shadow hover:from-blue-600 hover:to-pink-500 transition-all duration-300 text-sm">Sign Up</Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <FaTimes className="w-6 h-6 text-gray-700" />
          ) : (
            <FaBars className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 py-6 space-y-4">
          {(isPortalAdmin && (isCompanyRegisterPage || isPortalCompaniesPage)) ? (
            <>
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/portal-companies" label="Registered Companies" />
              <button
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                onClick={() => {
                  localStorage.removeItem('portalAdminToken');
                  localStorage.removeItem('portalAdminData');
                  window.location.href = '/portal-admin-login';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/jobs" label="Browse Jobs" />
              {user?.role === 'user' && <MobileNavLink to="/my-applications" label="My Applications" />}
              {user?.role === 'admin' && (
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-semibold ${location.pathname === '/post-job' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={handlePostJobClick}
                >
                  Post Job
                </button>
              )}
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/profile" label="Profile" />
                  {user?.role === 'admin' && <MobileNavLink to="/my-posted-jobs" label="My Posted Jobs" />}
                  {user?.role === 'user' && <MobileNavLink to="/my-applications" label="My Applications" />}
                  <button
                    onClick={() => setLogoutModalOpen(true)}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <MobileNavLink to="/login" label="Login" />
                  <Link 
                    to="/register" 
                    className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold shadow hover:from-blue-600 hover:to-pink-500 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .nav-underline {
          position: relative;
        }
        .nav-underline:after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -2px;
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #2563eb, #fc5c7d);
          opacity: 0;
          transform: scaleX(0.6);
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        .nav-underline.active:after,
        .nav-underline:hover:after {
          opacity: 1;
          transform: scaleX(1);
        }
      `}</style>
      <ConfirmModal
        open={logoutModalOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={() => { setLogoutModalOpen(false); handleLogout(); }}
        onCancel={() => setLogoutModalOpen(false)}
        confirmText="Logout"
        cancelText="Cancel"
      />
      <ConfirmModal
        open={postJobModalOpen}
        title="Start New Job Post?"
        message="You have unsaved changes. Are you sure you want to start a new job post? This will clear the form."
        onConfirm={() => {
          setPostJobModalOpen(false);
          // Navigate to /post-job with no state and force reload
          navigate('/post-job', { replace: true });
          window.location.reload();
        }}
        onCancel={() => setPostJobModalOpen(false)}
        confirmText="Start New"
        cancelText="Cancel"
      />
    </nav>
  );
};

function NavLink({ to, label }) {
  const isActive = window.location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-underline relative transition-colors duration-200 px-2 py-1 ${isActive ? 'active text-blue-600 font-bold' : 'hover:text-blue-600'}`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label }) {
  const isActive = window.location.pathname === to;
  return (
    <Link
      to={to}
      className={`block px-4 py-3 rounded-xl transition-colors font-semibold ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      {label}
    </Link>
  );
}

export default Navbar; 