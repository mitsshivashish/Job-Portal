import React, { useEffect, useState } from 'react';
import { getMyPostedJobs, deleteJob } from '../api/jobs';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import emptyAnim from '../assets/Animation - 1751910490425.json';
import ConfirmModal from '../components/ConfirmModal.jsx';

const fadeInScale = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const bgAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #fff3e0 0%, #ffe0b2 100%);
  background-size: 200% 200%;
  animation: ${bgAnim} 8s ease-in-out infinite;
  padding: 20px 0 32px 0;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 640px) {
    padding: 32px 0 32px 0;
  }
`;

const MainContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
  animation: ${fadeInScale} 0.7s cubic-bezier(0.4,0.8,0.2,1);
  
  @media (min-width: 640px) {
    padding: 0;
  }
`;

const Title = styled.h2`
  font-size: 1.8em;
  font-weight: 800;
  background: linear-gradient(90deg, #ff9800 20%, #ffd54f 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(255, 152, 0, 0.15);
  
  @media (min-width: 640px) {
    font-size: 2.2em;
    margin-bottom: 28px;
  }
`;

const JobCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.09);
  border-left: 6px solid #ff9800;
  padding: 20px 24px;
  margin-bottom: 20px;
  animation: ${fadeInScale} 0.7s cubic-bezier(0.4,0.8,0.2,1);
  position: relative;
  
  @media (min-width: 640px) {
    padding: 28px 32px;
    margin-bottom: 24px;
  }
`;

const JobField = styled.div`
  margin-bottom: 10px;
  font-size: 1.08em;
`;

const FieldLabel = styled.span`
  color: #bdbdbd;
  font-weight: 400;
  font-style: italic;
  margin-right: 8px;
  letter-spacing: 0.5px;
`;

const FieldValue = styled.span`
  color: #222;
  font-weight: 700;
  font-size: 1.08em;
  text-shadow: 0 1px 4px rgba(255, 152, 0, 0.08);
`;

const SkillsList = styled.span`
  color: #ff9800;
  font-weight: 600;
  font-style: italic;
  letter-spacing: 0.5px;
`;

const DescriptionValue = styled(FieldValue)`
  color: #a1887f;
  font-style: italic;
  font-weight: 500;
`;

const NoJobs = styled.div`
  text-align: center;
  color: #ff9800;
  font-size: 1.35em;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
`;

const ApplicantsButton = styled(Link)`
  color: #fff;
  background: linear-gradient(to right, #ff9800, #ffd54f);
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.13);
  transition: background 0.3s, transform 0.2s;
  display: inline-block;
  margin-top: 16px;
  font-size: 1em;
  letter-spacing: 0.5px;
  &:hover {
    background: linear-gradient(to right, #ffd54f, #ff9800);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.18);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(255, 152, 0, 0.09);
  }
`;

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    getMyPostedJobs().then(res => setJobs(res.data.data));
  }, []);

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete);
      setJobs(jobs => jobs.filter(j => j._id !== jobToDelete));
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  // For staggered animation
  const getCardStyle = idx => ({
    animationDelay: `${0.08 * idx}s`
  });

  return (
    <PageWrapper>
      <MainContainer>
        <Title>Jobs I Posted</Title>
        {jobs.length === 0 ? (
          <NoJobs>
            <Lottie animationData={emptyAnim} style={{ width: 220, height: 220 }} loop />
            <div>No jobs posted yet.</div>
          </NoJobs>
        ) : (
          jobs.map((job, idx) => (
            <JobCard key={job._id} style={getCardStyle(idx)}>
              <JobField><FieldLabel>Title:</FieldLabel> <FieldValue>{job.job_designation}</FieldValue></JobField>
              <JobField><FieldLabel>Category:</FieldLabel> <FieldValue>{job.job_category}</FieldValue></JobField>
              <JobField><FieldLabel>Location:</FieldLabel> <FieldValue>{job.job_location}</FieldValue></JobField>
              <JobField><FieldLabel>Company:</FieldLabel> <FieldValue>{job.company_name}</FieldValue></JobField>
              <JobField><FieldLabel>Salary:</FieldLabel> <FieldValue>{job.salary}</FieldValue></JobField>
              <JobField><FieldLabel>Apply By:</FieldLabel> <FieldValue>{job.apply_by}</FieldValue></JobField>
              <JobField><FieldLabel>Skills:</FieldLabel> <SkillsList>{Array.isArray(job.skills_required) ? job.skills_required.join(', ') : job.skills_required}</SkillsList></JobField>
              <JobField><FieldLabel>Openings:</FieldLabel> <FieldValue>{job.number_of_openings}</FieldValue></JobField>
              <JobField><FieldLabel>Description:</FieldLabel> <DescriptionValue>{job.description}</DescriptionValue></JobField>
              <JobField><FieldLabel>Posted By:</FieldLabel> <FieldValue>{job.posted_by?.name} ({job.posted_by?.email})</FieldValue></JobField>
              <div style={{ display: 'flex', gap: '12px', marginTop: 12 }}>
                <ApplicantsButton to={`/applicants/${job._id}`}>View Applicants</ApplicantsButton>
                <button
                  style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => navigate('/post-job', { state: { editMode: true, job } })}
                >Edit</button>
                <button
                  style={{ background: 'linear-gradient(90deg, #ff5f6d, #ffc371)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => { setDeleteModalOpen(true); setJobToDelete(job._id); }}
                >Delete</button>
              </div>
            </JobCard>
          ))
        )}
        <ConfirmModal
          open={deleteModalOpen}
          title="Delete Job"
          message="Are you sure you want to delete this job? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => { setDeleteModalOpen(false); setJobToDelete(null); }}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </MainContainer>
    </PageWrapper>
  );
};

export default MyPostedJobs; 