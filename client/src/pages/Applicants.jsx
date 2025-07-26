import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJobApplicants, fetchJob } from '../api/jobs.js';
import toast from 'react-hot-toast';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Tooltip from '@mui/material/Tooltip'; // Add this if using MUI, or use a simple title attribute

const fadeInScale = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px 0 32px 0;
  
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

const HeaderLink = styled(Link)`
  color: #007bff;
  font-weight: 500;
  margin-bottom: 18px;
  display: inline-block;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: #0056b3; text-decoration: underline; }
`;

const Title = styled.h1`
  font-size: 1.8em;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
  position: relative;
  transition: transform 0.3s;
  cursor: pointer;
  &:hover { transform: scale(1.02); }
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #007bff, #0056b3);
    margin: 15px 0 0 0;
    border-radius: 2px;
    transition: width 0.3s, background-position 1s;
    background-size: 200% 100%;
  }
  &:hover::after {
    width: 100px;
    background-position: 100% 0;
  }
  
  @media (min-width: 640px) {
    font-size: 2.1em;
  }
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 1em;
  margin-bottom: 20px;
  
  @media (min-width: 640px) {
    font-size: 1.08em;
    margin-bottom: 28px;
  }
`;

const JobSummaryCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.07);
  border: 1px solid #e9ecef;
  padding: 20px 24px;
  margin-bottom: 24px;
  animation: ${fadeInScale} 0.7s cubic-bezier(0.4,0.8,0.2,1);
  
  @media (min-width: 640px) {
    padding: 24px 28px;
    margin-bottom: 32px;
  }
`;

const JobSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
`;

const JobSummaryTitle = styled.h3`
  font-size: 1.1em;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 2px;
`;

const JobSummaryCompany = styled.p`
  color: #007bff;
  font-weight: 500;
`;

const JobSummaryLabel = styled.p`
  font-size: 0.98em;
  color: #6c757d;
  margin-bottom: 2px;
`;

const JobSummaryValue = styled.p`
  font-size: 1.05em;
  font-weight: 500;
  color: #343a40;
`;

const ApplicantCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.07);
  border: 1px solid #e9ecef;
  padding: 24px 28px;
  margin-bottom: 18px;
  animation: ${fadeInScale} 0.7s cubic-bezier(0.4,0.8,0.2,1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e0eafc, #007bff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3em;
  font-weight: 700;
  color: #fff;
  margin-right: 18px;
`;

const ApplicantInfo = styled.div`
  flex: 1;
`;

const ApplicantName = styled.h3`
  font-size: 1.1em;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 2px;
`;

const ApplicantEmail = styled.p`
  color: #6c757d;
  font-size: 0.98em;
  margin-bottom: 8px;
`;

const ApplicantGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 10px;
`;

const ResumeLink = styled.a`
  color: #007bff;
  font-size: 0.98em;
  text-decoration: underline;
  margin-top: 6px;
  display: inline-block;
  transition: color 0.2s;
  &:hover { color: #0056b3; }
`;

const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 22px;
  background: linear-gradient(to right, #007bff, #0056b3);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.98em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.13);
  transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
  outline: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:hover {
    background: linear-gradient(to right, #0056b3, #007bff);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.18);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.09);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const OutlineButton = styled(ActionButton)`
  background: #fff;
  color: #007bff;
  border: 1.5px solid #007bff;
  box-shadow: none;
  &:hover {
    background: #e0eafc;
    color: #0056b3;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.08);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 0 40px 0;
  color: #6c757d;
`;

const EmptyIcon = styled.div`
  margin-bottom: 18px;
  svg { width: 48px; height: 48px; color: #e0eafc; }
`;

const EmptyTitle = styled.h3`
  font-size: 1.2em;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 8px;
`;

const EmptyDesc = styled.p`
  color: #6c757d;
  margin-bottom: 18px;
`;

const Applicants = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const [applicantsResponse, jobResponse] = await Promise.all([
        fetchJobApplicants(id),
        fetchJob(id)
      ]);
      
      setApplicants(applicantsResponse.data.data.applicants || []);
      setJob(jobResponse.data.data);
    } catch (error) {
      console.error('Error loading applicants:', error);
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <div style={{ animation: 'spin 1s linear infinite', border: '4px solid #e0eafc', borderTop: '4px solid #007bff', borderRadius: '50%', width: 48, height: 48 }} />
        </div>
      </PageWrapper>
    );
  }



  return (
    <PageWrapper>
      <MainContainer>
        {/* Header */}
        <HeaderLink to={user?.role === 'admin' ? '/my-posted-jobs' : '/jobs'}>← Back to Jobs</HeaderLink>
        <Title>Applicants for {job?.job_designation}</Title>
        <Subtitle>
          {job?.company_name} • {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
        </Subtitle>

        {/* Job Summary Card */}
        {job && (
          <JobSummaryCard>
            <JobSummaryGrid>
              <div>
                <JobSummaryTitle>{job.job_designation}</JobSummaryTitle>
                <JobSummaryCompany>{job.company_name}</JobSummaryCompany>
              </div>
              <div>
                <JobSummaryLabel>Location</JobSummaryLabel>
                <JobSummaryValue>{job.job_location}</JobSummaryValue>
              </div>
              <div>
                <JobSummaryLabel>Salary</JobSummaryLabel>
                <JobSummaryValue>{job.salary}</JobSummaryValue>
              </div>
            </JobSummaryGrid>
          </JobSummaryCard>
        )}

        {/* Applicants List */}
        {applicants.length > 0 ? (
          <div>
            {applicants.map((applicant, index) => (
              <ApplicantCard key={applicant.applicant_id || index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar>{applicant.name.charAt(0).toUpperCase()}</Avatar>
                  <ApplicantInfo>
                    <ApplicantName>{applicant.name}</ApplicantName>
                    <ApplicantEmail>{applicant.email}</ApplicantEmail>
                    <ApplicantGrid>
                      <div>
                        <JobSummaryLabel>Contact</JobSummaryLabel>
                        <JobSummaryValue>{applicant.contact}</JobSummaryValue>
                      </div>
                      <div>
                        <JobSummaryLabel>Applied On</JobSummaryLabel>
                        <JobSummaryValue>
                          {applicant.appliedAt 
                            ? new Date(applicant.appliedAt).toLocaleDateString()
                            : 'N/A'}
                        </JobSummaryValue>
                      </div>
                    </ApplicantGrid>
                    {applicant.resumePath && (
                      <ResumeLink href={applicant.resumePath} target="_blank" rel="noopener noreferrer">
                        Resume: {applicant.resumePath}
                      </ResumeLink>
                    )}
                  </ApplicantInfo>
                </div>
                <CardActions>
                  <Tooltip title="Profile not available" placement="top">
                    <span>
                      <OutlineButton type="button" disabled style={{ cursor: 'not-allowed', opacity: 0.6 }}>View Profile</OutlineButton>
                    </span>
                  </Tooltip>
                  <ActionButton
                    as="a"
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(applicant.email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    Contact
                  </ActionButton>
                </CardActions>
              </ApplicantCard>
            ))}
          </div>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </EmptyIcon>
            <EmptyTitle>No applicants yet</EmptyTitle>
            <EmptyDesc>
              This job hasn't received any applications yet. Share the job posting to attract candidates.
            </EmptyDesc>
            <ActionButton as={Link} to={user?.role === 'admin' ? '/my-posted-jobs' : '/jobs'}>Back to Jobs</ActionButton>
          </EmptyState>
        )}
      </MainContainer>
    </PageWrapper>
  );
};

export default Applicants; 