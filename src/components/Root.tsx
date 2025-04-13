import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { checkAuth } from '../apis/authApi';
import { getAuthUserApi } from '../apis/userApi';
import { APP_ROUTES } from '../constants/constant';
import App from '../App';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Products from '../pages/Product';
import ProductDetail from '../pages/Product/ProductDetail';
import ProductEdit from '../pages/Product/ProductEdit';
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
        await checkAuth();
        const response = await getAuthUserApi();
        setUser(response.data);
        setAuth(true);
      } catch {
        setAuth(false);
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
          
          {/* Product Routes */}
          <Route path={APP_ROUTES.PRODUCT.ROUTE} element={<Products />} />
          <Route path={APP_ROUTES.PRODUCT_DETAIL.ROUTE} element={<ProductDetail />} />
          <Route path="/product/:id/edit" element={<ProductEdit />} />
          <Route path="/product/new" element={<ProductEdit />} />
          
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