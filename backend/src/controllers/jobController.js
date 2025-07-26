import mongoose from "mongoose";
import Job from "../models/Jobs.js";
import Application from '../models/application.js';
import User from '../models/users.js';

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let jobs = await Job.find({ apply_by: { $gte: today } })
      .populate('posted_by', 'name email')
      .sort({ createdAt: -1 });
    if (jobs.length === 0) {
      // Manual JS filter as fallback
      const allJobs = await Job.find().populate('posted_by', 'name email').sort({ createdAt: -1 });
      const manualFiltered = allJobs.filter(j => {
        if (!j.apply_by) return false;
        const d = new Date(j.apply_by);
        return d >= today;
      });
      if (manualFiltered.length > 0) {
        jobs = manualFiltered;
      } else {
        return res.json({ success: true, count: 0, data: [] });
      }
    }
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('posted_by', 'name email');

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create new job
export const createJob = async (req, res) => {
  try {
    const {
      job_category,
      job_type,
      job_designation,
      job_location,
      company_name,
      salary,
      apply_by,
      skills_required,
      number_of_openings,
      description,
      company_logo
    } = req.body;

    console.log('Received job data:', req.body);
    console.log('apply_by type:', typeof apply_by, apply_by);
    // Ensure apply_by is a Date and set to end of day UTC
    let applyByDate = apply_by;
    if (typeof apply_by === 'string') {
      // Always treat as UTC date at end of day
      applyByDate = new Date(apply_by + 'T23:59:59.999Z');
    }
    if (!(applyByDate instanceof Date) || isNaN(applyByDate)) {
      // Fallback: set to tomorrow end of day if invalid
      applyByDate = new Date();
      applyByDate.setDate(applyByDate.getDate() + 1);
      applyByDate.setHours(23, 59, 59, 999);
    }

    const job = await Job.create({
      job_category,
      job_type,
      job_designation,
      job_location,
      company_name,
      salary,
      apply_by: applyByDate,
      skills_required,
      number_of_openings,
      description,
      company_logo,
      posted_by: req.user.userId
    });

    const populatedJob = await Job.findById(job._id)
      .populate('posted_by', 'name email');

    res.status(201).json({
      success: true,
      data: populatedJob
    });
  } catch (error) {
    console.error('Error in createJob:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user owns the job or is admin
    if (job.posted_by.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to update this job' 
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('posted_by', 'name email');

    res.json({
      success: true,
      data: updatedJob
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user owns the job or is admin
    if (job.posted_by.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to delete this job' 
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Delete all applications for this job
    await Application.deleteMany({ job: req.params.id });

    res.json({
      success: true,
      message: 'Job and related applications deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Apply for job
export const applyForJob = async (req, res) => {
  try {
    const { name, email, contact, resumePath } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.find(
      applicant => applicant.email === email
    );
    if (alreadyApplied) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied for this job' 
      });
    }

    // Add applicant
    const applicantId = job.applicants.length + 1;
    job.applicants.push({
      applicant_id: applicantId,
      name,
      email,
      contact,
      resumePath,
      appliedAt: new Date()
    });

    await job.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get job applicants
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('posted_by', 'name email');

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user owns the job or is admin
    if (job.posted_by._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to view applicants' 
      });
    }

    res.json({
      success: true,
      data: {
        job: {
          _id: job._id,
          job_designation: job.job_designation,
          company_name: job.company_name
        },
        applicants: job.applicants
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get jobs by user
export const getJobsByUser = async (req, res) => {
  try {
    const jobs = await Job.find({ posted_by: req.params.userId })
      .populate('posted_by', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get jobs posted by the current admin user
export const getMyPostedJobs = async (req, res) => {
  console.log('getMyPostedJobs called, req.user:', req.user);
  try {
    const userId = req.user.userId;
    console.log('Fetching jobs for userId:', userId, typeof userId);
    const jobs = await Job.find({ posted_by: new mongoose.Types.ObjectId(userId) })
      .populate('posted_by', 'name email');
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error in getMyPostedJobs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured jobs
export const getFeaturedJobs = async (req, res) => {
  try {
    if (req.user && req.user.userId) {
      // User is logged in, get their skills
      const user = await User.findById(req.user.userId);
      if (!user || !user.skills || user.skills.length === 0) {
        // If no skills, return latest jobs
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let jobs = await Job.find({ apply_by: { $gte: today } }).sort({ createdAt: -1 }).limit(10);
        if (jobs.length === 0) {
          // Manual JS filter as fallback
          const allJobs = await Job.find().lean();
          const manualFiltered = allJobs.filter(j => {
            if (!j.apply_by) return false;
            const d = new Date(j.apply_by);
            return d >= today;
          });
          if (manualFiltered.length > 0) {
            jobs = manualFiltered;
          } else {
            return res.json({ success: true, data: [] });
          }
        }
        jobs.sort((a, b) => {
          const getNum = s => parseInt((s || '').replace(/[^\d]/g, '')) || 0;
          return getNum(b.salary) - getNum(a.salary);
        });
        if (jobs.every(j => !j.salary || parseInt((j.salary || '').replace(/[^\d]/g, '')) === 0)) {
          jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        jobs = jobs.slice(0, 10);
        return res.json({ success: true, data: jobs });
      } else {
        // Find jobs where any required skill matches user skills
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let jobs = await Job.find({
          skills_required: { $in: user.skills },
          apply_by: { $gte: today }
        }).sort({ createdAt: -1 }).limit(10);
        if (jobs.length === 0) {
          // Manual JS filter as fallback
          const allJobs = await Job.find().lean();
          const manualFiltered = allJobs.filter(j => {
            if (!j.apply_by) return false;
            const d = new Date(j.apply_by);
            return d >= today;
          });
          if (manualFiltered.length > 0) {
            jobs = manualFiltered;
          } else {
            return res.json({ success: true, data: [] });
          }
        }
        jobs.sort((a, b) => {
          const getNum = s => parseInt((s || '').replace(/[^\d]/g, '')) || 0;
          return getNum(b.salary) - getNum(a.salary);
        });
        if (jobs.every(j => !j.salary || parseInt((j.salary || '').replace(/[^\d]/g, '')) === 0)) {
          jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        jobs = jobs.slice(0, 10);
        return res.json({ success: true, data: jobs });
      }
    } else {
      // Not logged in: show jobs with highest salary
      // DEBUG: Fetch all jobs and log first one's apply_by
      const allJobs = await Job.find().lean();
      if (allJobs.length > 0) {
        console.log('First job apply_by:', allJobs[0].apply_by, 'Type:', typeof allJobs[0].apply_by, 'instanceof Date:', allJobs[0].apply_by instanceof Date);
        console.log('All job apply_by values:', allJobs.map(j => j.apply_by));
      } else {
        console.log('No jobs in collection');
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let jobs = await Job.find({ apply_by: { $gte: today } }).lean();
      console.log('Featured jobs (logged out) after date filter:', jobs.length);
      if (jobs.length === 0) {
        // Manual JS filter as fallback
        const manualFiltered = allJobs.filter(j => {
          if (!j.apply_by) return false;
          const d = new Date(j.apply_by);
          return d >= today;
        });
        console.log('Manual JS filter count:', manualFiltered.length);
        if (manualFiltered.length > 0) {
          jobs = manualFiltered;
        } else {
          return res.json({ success: true, data: [] });
        }
      }
      jobs.sort((a, b) => {
        const getNum = s => parseInt((s || '').replace(/[^\d]/g, '')) || 0;
        return getNum(b.salary) - getNum(a.salary);
      });
      if (jobs.every(j => !j.salary || parseInt((j.salary || '').replace(/[^\d]/g, '')) === 0)) {
        jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      jobs = jobs.slice(0, 10);
      console.log('Featured jobs (logged out) after sort/slice:', jobs.length);
      // Final safety filter to ensure no expired jobs are returned
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      jobs = jobs.filter(j => {
        if (!j.apply_by) return false;
        const d = new Date(j.apply_by);
        return d >= now;
      });
      // Log apply_by values and types for debugging
      console.log('Featured jobs apply_by values:', jobs.map(j => ({ apply_by: j.apply_by, type: typeof j.apply_by, isDate: j.apply_by instanceof Date })));
      res.json({ success: true, data: jobs });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recommended jobs for the current user
export const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log('User skills:', user && user.skills);
    if (!user || !Array.isArray(user.skills) || user.skills.length === 0) {
      // If no skills, return all jobs (limit 20)
      let jobs = await Job.find().sort({ createdAt: -1 }).limit(20);
      // Final safety filter to ensure no expired jobs are returned
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      jobs = jobs.filter(j => {
        if (!j.apply_by) return false;
        const d = new Date(j.apply_by);
        return d >= now;
      });
      console.log('Recommended jobs apply_by values:', jobs.map(j => ({ apply_by: j.apply_by, type: typeof j.apply_by, isDate: j.apply_by instanceof Date })));
      console.log('Returned all jobs, count:', jobs.length);
      return res.json({ success: true, data: jobs });
    }
    // Find jobs where any required skill matches user skills
    let jobs = await Job.find({
      skills_required: { $in: user.skills }
    }).sort({ createdAt: -1 }).limit(20);
    // Final safety filter to ensure no expired jobs are returned
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    jobs = jobs.filter(j => {
      if (!j.apply_by) return false;
      const d = new Date(j.apply_by);
      return d >= now;
    });
    console.log('Recommended jobs apply_by values:', jobs.map(j => ({ apply_by: j.apply_by, type: typeof j.apply_by, isDate: j.apply_by instanceof Date })));
    console.log('Returned recommended jobs, count:', jobs.length);
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};