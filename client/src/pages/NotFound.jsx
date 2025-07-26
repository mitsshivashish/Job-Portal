import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #232526 0%, #414345 100%);
  color: #fff;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  letter-spacing: 4px;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: 640px) {
    font-size: 8rem;
    letter-spacing: 8px;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #e0e0e0;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    font-size: 2rem;
    padding: 0;
  }
`;

const HomeButton = styled(Link)`
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  margin-top: 1.5rem;
  
  @media (min-width: 640px) {
    padding: 16px 40px;
    font-size: 1.3rem;
  }
  
  &:hover {
    background: linear-gradient(90deg, #0072ff, #00c6ff);
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 10px 28px rgba(0, 123, 255, 0.5);
  }
`;

const NotFound = () => (
  <NotFoundWrapper>
    <ErrorCode>404</ErrorCode>
    <ErrorMessage>Oops! The page you are looking for does not exist.</ErrorMessage>
    <HomeButton to="/">Go to Homepage</HomeButton>
  </NotFoundWrapper>
);

export default NotFound; 