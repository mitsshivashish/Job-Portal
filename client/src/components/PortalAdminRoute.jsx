import React from 'react';
import { Navigate } from 'react-router-dom';

const PortalAdminRoute = ({ children }) => {
  const portalAdminToken = localStorage.getItem('portalAdminToken');
  
  if (!portalAdminToken) {
    return <Navigate to="/portal-admin-login" replace />;
  }
  
  return children;
};

export default PortalAdminRoute; 