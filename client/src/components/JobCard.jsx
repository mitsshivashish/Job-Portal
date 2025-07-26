import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import profileLottie from '../assets/Animation - 1751910490425.json';

const StyledJobCard = styled.div`
  background: linear-gradient(135deg, #f9fbfd, #f2f5f7);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  max-width: 380px;
  width: 100%;
  cursor: default;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 600px) {
    padding: 24px 20px;
    max-width: 100%;
    border-radius: 12px;
    text-align: center;
  }
`;

const CompanyLogo = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(45deg, #6a82fb, #fc5c7d);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  font-weight: bold;
  color: white;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.15);
  margin-bottom: 25px;
  @media (max-width: 600px) {
    width: 64px;
    height: 64px;
    font-size: 28px;
    margin: 0 auto 20px auto;
  }
`;

const JobTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #212121;
  margin-bottom: 6px;
  line-height: 1.2;
  @media (max-width: 600px) {
    font-size: 22px;
    text-align: center;
  }
`;

const CompanyName = styled.p`
  font-size: 17px;
  color: #616161;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    font-size: 16px;
    margin-bottom: 16px;
    text-align: center;
  }
`;

const JobType = styled.div`
  display: inline-block;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 16px;
  padding: 6px 18px;
  margin-bottom: 14px;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.13);
  letter-spacing: 0.2px;
  @media (max-width: 600px) {
    font-size: 14px;
    padding: 8px 16px;
    margin: 0 auto 12px auto;
    display: block;
    width: fit-content;
  }
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  @media (max-width: 600px) {
    gap: 8px;
    margin-bottom: 18px;
    justify-content: center;
  }
`;

const TechTag = styled.span`
  background: rgba(0, 0, 0, 0.07);
  color: #424242;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  &:hover {
    transform: translateY(-2px) scale(1.03);
    background-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  @media (max-width: 600px) {
    font-size: 13px;
    padding: 7px 12px;
  }
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #757575;
  font-size: 16px;
  margin-bottom: 12px;
  @media (max-width: 600px) {
    font-size: 14px;
    gap: 6px;
    margin-bottom: 10px;
    justify-content: center;
  }
`;

const ApplyDate = styled.p`
  color: #9E9E9E;
  font-size: 15px;
  margin-top: auto;
  padding-top: 20px;
  @media (max-width: 600px) {
    font-size: 13px;
    padding-top: 12px;
    text-align: center;
  }
`;

const ViewDetailsButton = styled(Link)`
  background: linear-gradient(45deg, #007bff, #00d4ff);
  color: white;
  padding: 16px 35px;
  border: none;
  border-radius: 30px;
  font-size: 19px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  margin-top: 30px;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  transition: all 0.3s ease-in-out;
  width: 100%;
  letter-spacing: 0.5px;
  outline: none;
  display: block;
  &:hover {
    background: linear-gradient(45deg, #0056b3, #00aaff);
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 10px 28px rgba(0, 123, 255, 0.5);
  }
  &:active {
    transform: translateY(0px) scale(0.99);
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  }
  @media (max-width: 600px) {
    font-size: 16px;
    padding: 14px 20px;
    margin-top: 20px;
    border-radius: 25px;
  }
`;

const DEFAULT_LOGO = '/logo.svg'; // Use your default logo path in public/

const JobCard = ({ job }) => {
  if (!job) return null;
  return (
    <StyledJobCard>
      <CompanyLogo as="div" style={{background: 'none', boxShadow: 'none', padding: 0}}>
        {job.company_logo ? (
          <img
            src={job.company_logo}
            alt="Company Logo"
            style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: '50%', background: '#f4f6fa', border: '1px solid #eee' }}
          />
        ) : (
          <span style={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #6a82fb, #fc5c7d)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 26,
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)',
            border: '1px solid #eee'
          }}>
            {job.company_name ? job.company_name[0].toUpperCase() : 'C'}
          </span>
        )}
      </CompanyLogo>
      <JobTitle>{job.job_designation}</JobTitle>
      <CompanyName>{job.company_name}</CompanyName>
      {job.job_type && <JobType>{job.job_type}</JobType>}
      <TechTags>
        {Array.isArray(job.skills_required)
          ? job.skills_required.slice(0, 5).map((skill, idx) => (
              <TechTag key={idx}>{skill}</TechTag>
            ))
          : job.skills_required && <TechTag>{job.skills_required}</TechTag>}
      </TechTags>
      <Location>
        <span className="location-icon" role="img" aria-label="location-pin">📍</span>
        {job.job_location}
      </Location>
      <ApplyDate>Apply by: {job.apply_by ? new Date(job.apply_by).toLocaleDateString() : 'N/A'}</ApplyDate>
      <ViewDetailsButton to={`/jobs/${job._id}`}>View Details</ViewDetailsButton>
    </StyledJobCard>
  );
};

export default JobCard; 