import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
  const { admin } = useAuth();
  return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
