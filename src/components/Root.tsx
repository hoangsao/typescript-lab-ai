import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { checkAuth } from '../apis/authApi';
import { getAuthUser } from '../apis/userApi';
import { APP_ROUTES } from '../constants/constant';
import App from '../App';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';
import NotFound from '../pages/NotFound';

const Root = () => {
  const { isAuthenticated, setAuth } = useAuthStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth(); // Call the checkAuth function from authApi
        const response = await getAuthUser(); // Call the getAuthUser function to fetch user data
        setUser(response.data); // Set the user data in the store
        setAuth(true); // Set the authenticated user in the store
      } catch {
        setAuth(false); // Clear authentication if checkAuth fails
      }
    };

    verifyAuth();
  }, [setAuth, setUser]);

  const renderLoading = () => {
    return <div className='loading-container'>
      <Spin percent='auto' size="large" />
    </div>
  }

  if (isAuthenticated === null) {
    // Show a loading state while checking authentication
    return renderLoading();
  }

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path={APP_ROUTES.HOME.ROUTE} element={<App />} />
          <Route path={APP_ROUTES.PROFILE.ROUTE} element={<Profile />} />
          {/* Add other protected routes here */}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path={APP_ROUTES.LOGIN.ROUTE} element={<Login />} />
          {/* Add other public routes here */}
          <Route path="*" element={<Navigate to={APP_ROUTES.LOGIN.ROUTE} replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Root;