import React, { useState, useEffect, useCallback } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Avatar, 
  Divider, 
  Row, 
  Col, 
  message,
  Select,
  DatePicker,
  InputNumber
} from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import useUserStore from '../../store/userStore';
import { updateProfile } from '../../apis/userApi';
import { User, Address, Company } from '../../models/user';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Profile: React.FC = () => {
  const { user, updateUser } = useUserStore();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Reset form with user data
  const resetForm = useCallback(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        maidenName: user.maidenName,
        email: user.email,
        phone: user.phone,
        username: user.username,
        gender: user.gender,
        birthDate: user.birthDate ? dayjs(user.birthDate) : null,
        height: user.height,
        weight: user.weight,
        bloodGroup: user.bloodGroup,
        eyeColor: user.eyeColor,
        hairColor: user.hair?.color,
        hairType: user.hair?.type,
        university: user.university,
        // Address fields
        street: user.address?.address,
        city: user.address?.city,
        state: user.address?.state,
        postalCode: user.address?.postalCode,
        country: user.address?.country,
        // Company fields
        companyName: user.company?.name,
        companyTitle: user.company?.title,
        companyDepartment: user.company?.department,
      });
    }
  }, [user, form]);

  useEffect(() => {
    resetForm();
  }, [user, form, resetForm]);

  const handleEdit = () => {
    resetForm(); // Reset form before entering edit mode
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetForm(); // Reset form when canceling
    setIsEditing(false);
  };

  const handleSave = async () => {
    if(!user) {
      return
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const address: Address = {
        ...(user.address || {}),
        address: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      }

      const company: Company = {
        ...(user.company || {}),
        name: values.companyName,
        title: values.companyTitle,
        department: values.companyDepartment,
      }

      // Prepare data for API
      const updateData: Partial<User> = {
        firstName: values.firstName,
        lastName: values.lastName,
        maidenName: values.maidenName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : user.birthDate,
        height: values.height,
        weight: values.weight,
        bloodGroup: values.bloodGroup,
        eyeColor: values.eyeColor,
        university: values.university,
        
        // Structured fields
        hair: {
          color: values.hairColor || user?.hair?.color || '',
          type: values.hairType || user?.hair?.type || ''
        },
        
        address,
        
        company
      };
      
      const response = await updateProfile(user.id, updateData);
      
      if (response.success && response.data) {
        updateUser(response.data);
        messageApi.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        messageApi.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      messageApi.error('Please check your form inputs');
      console.error('Form validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <Text>Please log in to view your profile</Text>
      </Card>
    );
  }

  return (
    <>
      {contextHolder}
      <Card 
        title={
          <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
            <Avatar 
              size={100} 
              src={user.image} 
              icon={!user.image && <UserOutlined />} 
            />
            <Title level={3}>{user.firstName} {user.lastName}'s Profile</Title>
          </Space>
        }
        extra={
          isEditing ? (
            <Space>
              <Button 
                icon={<CloseOutlined />} 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSave}
                loading={loading}
              >
                Save
              </Button>
            </Space>
          ) : (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          )
        }
        style={{ maxWidth: 1000, margin: '0 auto', marginTop: 20, marginBottom: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={!isEditing}
        >
          <Divider orientation="left">Basic Information</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="maidenName"
                label="Maiden Name"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Username is required' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Phone number is required' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Gender is required' }]}
              >
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="birthDate"
                label="Birth Date"
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Physical Information</Divider>
          
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="height"
                label="Height (cm)"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="weight"
                label="Weight (kg)"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="bloodGroup"
                label="Blood Group"
              >
                <Select>
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="eyeColor"
                label="Eye Color"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="hairColor"
                label="Hair Color"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="hairType"
                label="Hair Type"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="university"
                label="University"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Address Information</Divider>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="street"
                label="Street Address"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="city"
                label="City"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="state"
                label="State"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="postalCode"
                label="Postal Code"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="country"
                label="Country"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Employment Information</Divider>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="companyName"
                label="Company"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="companyTitle"
                label="Job Title"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="companyDepartment"
                label="Department"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {!isEditing && (
            <div style={{ marginTop: 20 }}>
              <Divider orientation="left">Additional Information</Divider>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <Card size="small" bordered={false} style={{ background: '#f9f9f9' }}>
                    <Row gutter={[16, 8]}>
                      {user.macAddress && (
                        <Col xs={24} sm={12}>
                          <Text strong>MAC Address: </Text>
                          <Text>{user.macAddress}</Text>
                        </Col>
                      )}
                      {user.ip && (
                        <Col xs={24} sm={12}>
                          <Text strong>IP Address: </Text>
                          <Text>{user.ip}</Text>
                        </Col>
                      )}
                      {user.ssn && (
                        <Col xs={24} sm={12}>
                          <Text strong>SSN: </Text>
                          <Text>{user.ssn}</Text>
                        </Col>
                      )}
                      {user.ein && (
                        <Col xs={24} sm={12}>
                          <Text strong>EIN: </Text>
                          <Text>{user.ein}</Text>
                        </Col>
                      )}
                      {user.crypto && (
                        <>
                          <Col xs={24} sm={12}>
                            <Text strong>Crypto Coin: </Text>
                            <Text>{user.crypto.coin}</Text>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Text strong>Wallet: </Text>
                            <Text>{user.crypto.wallet}</Text>
                          </Col>
                        </>
                      )}
                      {user.bank && (
                        <>
                          <Col xs={24} sm={12}>
                            <Text strong>Bank Card: </Text>
                            <Text>{user.bank.cardType}</Text>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Text strong>Currency: </Text>
                            <Text>{user.bank.currency}</Text>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </Card>
    </>
  );
};

export default Profile;