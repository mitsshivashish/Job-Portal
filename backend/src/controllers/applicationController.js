import Application from '../models/application.js';
import User from '../models/users.js';
import Job from '../models/Jobs.js';

// Helper function to extract userId from req.user (handles both JWT and session auth)
const getUserId = (req) => {
  if (req.user && req.user.userId) {
    return req.user.userId; // JWT authentication
  } else if (req.user && req.user._id) {
    return req.user._id; // Session-based authentication (Passport)
  }
  return null;
};

export const applyForJob = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const { jobId, name, email, contact, resumePath } = req.body;

    // Only users (not admins) can apply
    const user = await User.findById(userId);
    if (!user || user.role !== 'user') {
      return res.status(403).json({ success: false, message: 'Only job seekers can apply for jobs.' });
    }

    // Prevent duplicate applications
    const alreadyApplied = await Application.findOne({ user: userId, job: jobId });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
    }

    // Create Application document (store applicant details if desired)
    const application = await Application.create({ user: userId, job: jobId, name, email, contact, resumePath });

    // Add applicant info to Job's applicants array
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    // Prevent duplicate in job's applicants array (by email)
    const alreadyInApplicants = job.applicants.some(app => app.email === email);
    if (!alreadyInApplicants) {
      job.applicants.push({
        applicant_id: job.applicants.length + 1,
        name,
        email,
        contact: contact || '',
        resumePath: resumePath || '',
        appliedAt: new Date()
      });
      // Decrement number_of_openings if greater than 0
      if (job.number_of_openings > 0) {
        job.number_of_openings -= 1;
      }
      await job.save();
    }

    res.status(201).json({ success: true, data: application, job });
  } catch (error) {
    console.error('Error in applyForJob:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const applications = await Application.find({ user: userId }).populate('job');
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 