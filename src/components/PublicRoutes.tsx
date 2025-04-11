import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { APP_ROUTES } from '../constants/constant';

const PublicRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.HOME.ROUTE} replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;