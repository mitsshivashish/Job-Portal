import React, { useEffect, useState } from 'react';
import { getMyApplications } from '../api/jobs';
import styled, { keyframes } from 'styled-components';
import { FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Lottie from 'lottie-react';
import emptyAnim from '../assets/Animation - 1751910490425.json';

const CARDS_PER_PAGE = 6;

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
  background: linear-gradient(120deg, #e0f7fa 0%, #b2dfdb 100%);
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
  max-width: 1100px;
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
  background: linear-gradient(90deg, #009688 20%, #43e97b 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(67, 233, 123, 0.15);
  
  @media (min-width: 640px) {
    font-size: 2.2em;
    margin-bottom: 28px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 28px;
  }
`;

const AppCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.09);
  border-left: 6px solid #009688;
  padding: 20px 24px;
  animation: ${fadeInScale} 0.7s cubic-bezier(0.4,0.8,0.2,1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  
  @media (min-width: 640px) {
    padding: 28px 32px;
  }
`;

const JobField = styled.div`
  margin-bottom: 10px;
  font-size: 1.08em;
`;

const FieldLabel = styled.span`
  color: #6c757d;
  font-weight: 400;
  font-style: italic;
  margin-right: 8px;
  letter-spacing: 0.5px;
`;

const FieldValue = styled.span`
  color: #222;
  font-weight: 700;
  font-size: 1.08em;
  text-shadow: 0 1px 4px rgba(0, 150, 136, 0.08);
`;

const SkillsList = styled.span`
  color: #009688;
  font-weight: 600;
  font-style: italic;
  letter-spacing: 0.5px;
`;

const DescriptionValue = styled(FieldValue)`
  color: #607d8b;
  font-style: italic;
  font-weight: 500;
`;

const AppStatus = styled.div`
  margin-top: 12px;
  font-size: 1em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.98em;
  font-weight: 700;
  background: ${({ status }) =>
    status === 'Accepted' ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' :
    status === 'Pending' ? 'linear-gradient(90deg, #fceabb 0%, #f8b500 100%)' :
    'linear-gradient(90deg, #f85032 0%, #e73827 100%)'};
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.13);
`;

const AppliedDate = styled.div`
  font-size: 0.98em;
  color: #6c757d;
  margin-top: 4px;
`;

const NoApps = styled.div`
  text-align: center;
  color: #009688;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 8px 18px;
  background: linear-gradient(to right, #009688, #43e97b);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 150, 136, 0.13);
  transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
  outline: none;
  &:hover {
    background: linear-gradient(to right, #43e97b, #009688);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 150, 136, 0.18);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(0, 150, 136, 0.09);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyApplications().then(res => setApplications(res.data.data));
  }, []);

  const startIdx = (page - 1) * CARDS_PER_PAGE;
  const endIdx = startIdx + CARDS_PER_PAGE;
  const paginatedApps = applications.slice(startIdx, endIdx);
  const totalPages = Math.ceil(applications.length / CARDS_PER_PAGE);

  // For staggered animation
  const getCardStyle = idx => ({
    animationDelay: `${0.08 * idx}s`
  });

  const getStatusIcon = status => {
    if (status === 'Accepted') return <FaCheckCircle style={{ color: '#fff' }} />;
    if (status === 'Pending') return <FaClock style={{ color: '#fff' }} />;
    return <FaTimesCircle style={{ color: '#fff' }} />;
  };

  return (
    <PageWrapper>
      <MainContainer>
        <Title>My Applications</Title>
        {applications.length === 0 ? (
          <NoApps>
            <Lottie animationData={emptyAnim} style={{ width: 220, height: 220 }} loop />
            <div>No applications yet.</div>
          </NoApps>
        ) : (
          <>
            <Grid>
              {paginatedApps.map((app, idx) => (
                <AppCard key={app._id} style={getCardStyle(idx)}>
                  <JobField><FieldLabel>Title:</FieldLabel> <FieldValue>{app.job?.job_designation}</FieldValue></JobField>
                  <JobField><FieldLabel>Category:</FieldLabel> <FieldValue>{app.job?.job_category}</FieldValue></JobField>
                  <JobField><FieldLabel>Location:</FieldLabel> <FieldValue>{app.job?.job_location}</FieldValue></JobField>
                  <JobField><FieldLabel>Company:</FieldLabel> <FieldValue>{app.job?.company_name}</FieldValue></JobField>
                  <JobField><FieldLabel>Salary:</FieldLabel> <FieldValue>{app.job?.salary}</FieldValue></JobField>
                  <JobField><FieldLabel>Apply By:</FieldLabel> <FieldValue>{app.job?.apply_by}</FieldValue></JobField>
                  <JobField><FieldLabel>Skills:</FieldLabel> <SkillsList>{Array.isArray(app.job?.skills_required) ? app.job.skills_required.join(', ') : app.job?.skills_required}</SkillsList></JobField>
                  <JobField><FieldLabel>Openings:</FieldLabel> <FieldValue>{app.job?.number_of_openings}</FieldValue></JobField>
                  <JobField><FieldLabel>Description:</FieldLabel> <DescriptionValue>{app.job?.description}</DescriptionValue></JobField>
                  {app.status && (
                    <AppStatus>
                      <StatusBadge status={app.status}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </StatusBadge>
                    </AppStatus>
                  )}
                  {app.appliedAt && <AppliedDate>Applied On: {new Date(app.appliedAt).toLocaleDateString()}</AppliedDate>}
                  {app.resumePath && <JobField><FieldLabel>Resume:</FieldLabel> <a href={app.resumePath} target="_blank" rel="noopener noreferrer" style={{ color: '#009688', textDecoration: 'underline', fontWeight: 600 }}><FaFileAlt style={{ marginRight: 4 }} />View Resume</a></JobField>}
                </AppCard>
              ))}
            </Grid>
            {totalPages > 1 && (
              <Pagination>
                <PageButton onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</PageButton>
                <span style={{ fontWeight: 700, color: '#009688' }}>{page} / {totalPages}</span>
                <PageButton onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</PageButton>
              </Pagination>
            )}
          </>
        )}
      </MainContainer>
    </PageWrapper>
  );
};

export default MyApplications; 