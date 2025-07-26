import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CompanyRegister from './pages/CompanyRegister.jsx';
import PortalAdminLogin from './pages/PortalAdminLogin.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetails from './pages/JobDetails.jsx';
import PostJob from './pages/PostJob.jsx';
import Applicants from './pages/Applicants.jsx';
import Profile from './pages/Profile.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import MyApplications from './pages/MyApplications.jsx';
import MyPostedJobs from './pages/MyPostedJobs.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import NotFound from './pages/NotFound.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import PortalCompanies from './pages/PortalCompanies.jsx';
import PortalAdminRoute from './components/PortalAdminRoute.jsx';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <Home />
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <Register />
          </motion.div>
        } />
        <Route path="/company-register" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <CompanyRegister />
          </motion.div>
        } />
        <Route path="/portal-admin-login" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <PortalAdminLogin />
          </motion.div>
        } />
        <Route path="/forgot-password" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <ForgotPassword />
          </motion.div>
        } />
        <Route path="/reset-password" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <ResetPassword />
          </motion.div>
        } />
        <Route path="/jobs" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <Jobs />
          </motion.div>
        } />
        <Route path="/jobs/:id" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <JobDetails />
          </motion.div>
        } />
        <Route path="/post-job" element={
          <PrivateRoute>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <PostJob />
            </motion.div>
          </PrivateRoute>
        } />
        {/* <Route path="/jobs/:id/applicants" element={ */}
        <Route path="/applicants/:id" element={
          <PrivateRoute>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <Applicants />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <Profile />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/my-applications" element={
          <PrivateRoute>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <MyApplications />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/my-posted-jobs" element={
          <PrivateRoute>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <MyPostedJobs />
            </motion.div>
          </PrivateRoute>
        } />
        <Route path="/portal-companies" element={
          <PortalAdminRoute>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <PortalCompanies />
            </motion.div>
          </PortalAdminRoute>
        } />
        {/* Redirect old routes to new ones */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        {/* 404 route - must be last */}
        <Route path="*" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <NotFound />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <AnimatedRoutes />
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
