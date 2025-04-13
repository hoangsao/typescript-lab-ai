import React, { ReactNode, useEffect } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { useLocation, useNavigate, matchRoutes } from 'react-router-dom';
import { ContainerOutlined, HomeOutlined, LogoutOutlined, OrderedListOutlined, ProductOutlined, ProjectOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import LogoUrl from '../assets/logo-grayscale-white.svg';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import { logout } from '../apis/authApi';
import './Layout.scss';
import { APP_ROUTES } from '../constants/constant';

const { Header, Content, Footer } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { clearAuth } = useAuthStore();
  const { user } = useUserStore();
  const navigate = useNavigate()
  const location = useLocation()
  const [currentKey, setCurrentKey] = React.useState(APP_ROUTES.HOME.KEY)

  const handleLogout = async () => {
    await logout()
    clearAuth()
    navigate(APP_ROUTES.LOGIN.ROUTE, { replace: true })
  }

  const getRoute = (key: string) => {
    const route = Object.values(APP_ROUTES).find((route) => route.KEY === key)
    return route
  }

  const onLeftNavClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    const route = getRoute(e.key)
    if (route) {
      navigate(route.ROUTE)
    }
  }

  const onRightNavClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    if (e.key === 'profile') {
      navigate(APP_ROUTES.PROFILE.ROUTE)
    }
    else if (e.key === 'logout') {
      handleLogout()
    }
  }

  const renderLeftNav = () => {
    const leftNavItems: MenuItem[] = [
      {
        key: APP_ROUTES.HOME.KEY,
        label: APP_ROUTES.HOME.TITLE,
        icon: <HomeOutlined />,
      },
      {
        key: APP_ROUTES.PRODUCT.KEY,
        label: APP_ROUTES.PRODUCT.TITLE,
        icon: <ProductOutlined />,
      },
      {
        key: APP_ROUTES.PROJECT.KEY,
        label: APP_ROUTES.PROJECT.TITLE,
        icon: <ProjectOutlined />,
      },
      {
        key: APP_ROUTES.POST.KEY,
        label: APP_ROUTES.POST.TITLE,
        icon: <SolutionOutlined />,
      },
      {
        key: APP_ROUTES.RECIPE.KEY,
        label: APP_ROUTES.RECIPE.TITLE,
        icon: <ContainerOutlined />
      },
      {
        key: APP_ROUTES.TODO.KEY,
        label: APP_ROUTES.TODO.TITLE,
        icon: <OrderedListOutlined />,
      },
    ]

    return <Menu className='main-menu left-nav' theme="dark" onClick={onLeftNavClick} selectedKeys={[currentKey]} mode="horizontal" items={leftNavItems} />
  }

  const renderRightNav = () => {
    if (!user) {
      return
    }

    const rightNavItems: MenuItem[] = [
      {
        key: 'profile-group',
        icon: user.image ? <img className='user-image' src={user.image} /> : <UserOutlined />,
        label: `${user.firstName} ${user.lastName}`,
        children: [
          {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
          },
          {
            type: 'divider',
          },
          {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />
          },
        ],
      }
    ]

    return <Menu className='user-menu right-nav' theme="dark" onClick={onRightNavClick} mode="horizontal" items={rightNavItems} selectable={false} />
  }

  useEffect(() => {
    const routes = Object.values(APP_ROUTES).map((route) => {
      return {
        ...route,
        path: route.ROUTE,
      }
    });

    const matches = matchRoutes(routes, location.pathname);
    if (matches) {
      setCurrentKey(matches[0].route.KEY)
    }
    else {
      setCurrentKey('')
    }
  }, [location.pathname])

  return (
    <Layout>
      <Header className="header">
        <div className="logo"><img src={LogoUrl} alt='' /></div>
        {renderLeftNav()}
        {renderRightNav()}
      </Header>
      <Content className="content">
        {children}
      </Content>
      <Footer className="footer">Typescript Lab ©2025 Created by Sao Dao</Footer>
    </Layout>
  );
};

export default AppLayout;