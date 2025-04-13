import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../apis/authApi';
import useAuthStore from '../../store/authStore';
import { APP_ROUTES } from '../../constants/constant';
import { getAuthUserApi } from '../../apis/userApi';
import useUserStore from '../../store/userStore';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { setUser } = useUserStore(); // Import the setUser function from the user store
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(
        values.username,
        values.password
      );
      const response = await getAuthUserApi(); // Updated to use getAuthUserApi
      setUser(response.data); // Set the user data in the store
      setAuth(true);
      messageApi.success('Login successful!');
      navigate(APP_ROUTES.HOME.ROUTE, { replace: true }); // Redirect to homepage after successful login
    } catch {
      messageApi.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
        <h1>Login</h1>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;