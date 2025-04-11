import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AppLayout from './Layout';
import useAuthStore from '../store/authStore';
import { APP_ROUTES } from '../constants/constant';

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN.ROUTE} replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoutes;