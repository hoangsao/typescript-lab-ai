import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  message,
  Space,
  Divider,
  Row,
  Col,
  Flex,
  FormProps
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { getProductByIdApi, updateProductApi, createProductApi } from '../../apis/productApi';
import { Product, Dimensions } from '../../models/product';

const { Title } = Typography;
const { TextArea } = Input;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== 'new' && id !== undefined;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    setInitialLoading(true);
    try {
      const response = await getProductByIdApi(parseInt(id));
      if (response.success && response.data) {
        const product = response.data;
        form.setFieldsValue({
          title: product.title,
          description: product.description,
          price: product.price,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          brand: product.brand,
          category: product.category,
          sku: product.sku,
          weight: product.weight,
          tags: product.tags,
          warrantyInformation: product.warrantyInformation,
          shippingInformation: product.shippingInformation,
          returnPolicy: product.returnPolicy,
          minimumOrderQuantity: product.minimumOrderQuantity,
          availabilityStatus: product.availabilityStatus,
          dimensions: product.dimensions,
          thumbnail: product.thumbnail,
          images: product.images?.join('\n')
        });
      } else {
        messageApi.error(response.message || 'Failed to fetch product details');
        navigate('/product');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      messageApi.error('An error occurred while fetching product details');
      navigate('/product');
    } finally {
      setInitialLoading(false);
    }
  }, [id, form, messageApi, navigate]);

  const handleSubmit: FormProps['onFinish'] = async (values) => {
    setLoading(true);

    try {
      // Process tags properly
      const tagsList = Array.isArray(values.tags) ? values.tags : [];

      // Process dimensions
      let dimensions: Dimensions | undefined = undefined;
      if (values.dimensions?.width || values.dimensions?.height || values.dimensions?.depth) {
        dimensions = {
          width: values.dimensions.width || 0,
          height: values.dimensions.height || 0,
          depth: values.dimensions.depth || 0
        };
      }

      // Process images
      const images = values.images ? values.images.split('\n').filter((url: string) => url.trim().length > 0) : undefined;

      const productData: Partial<Product> = {
        ...values,
        tags: tagsList,
        dimensions,
        images
      };

      let response;
      if (isEditMode && id) {
        response = await updateProductApi(parseInt(id), productData);
      } else {
        response = await createProductApi(productData as Omit<Product, 'id'>);
      }

      if (response.success && response.data) {
        messageApi.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate(`/product/${response.data.id}`);
      } else {
        messageApi.error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
      messageApi.error(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the product`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    } else {
      setInitialLoading(false);
    }
  }, [isEditMode, id, fetchProduct]);

  if (initialLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(isEditMode ? `/product/${id}` : '/product')}
          >
            {isEditMode ? 'Back to Product Details' : 'Back to Products'}
          </Button>
        </div>

        <Card>
          <Title level={2}>{isEditMode ? 'Edit Product' : 'Create New Product'}</Title>
          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              price: 0,
              stock: 0,
              dimensions: {
                width: 0,
                height: 0,
                depth: 0
              }
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={16}>
                <Form.Item
                  name="title"
                  label="Product Title"
                  rules={[{ required: true, message: 'Please enter product title' }]}
                >
                  <Input placeholder="Enter product title" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="sku"
                  label="SKU"
                  rules={[{ required: true, message: 'Please enter product SKU' }]}
                >
                  <Input placeholder="Enter SKU" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please enter product description' }]}
                >
                  <TextArea rows={4} placeholder="Enter product description" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    precision={2}
                    style={{ width: '100%' }}
                    addonBefore="$"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="discountPercentage"
                  label="Discount Percentage"
                >
                  <InputNumber
                    min={0}
                    max={100}
                    step={0.1}
                    precision={1}
                    style={{ width: '100%' }}
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="stock"
                  label="Stock"
                  rules={[{ required: true, message: 'Please enter stock quantity' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="minimumOrderQuantity"
                  label="Minimum Order Quantity"
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[{ required: true, message: 'Please enter brand' }]}
                >
                  <Input placeholder="Enter brand" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please enter category' }]}
                >
                  <Input placeholder="Enter category" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="weight"
                  label="Weight (kg)"
                >
                  <InputNumber min={0} step={0.1} precision={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Dimensions</Divider>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name={['dimensions', 'width']}
                  label="Width (cm)"
                >
                  <InputNumber min={0} step={0.01} precision={2} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name={['dimensions', 'height']}
                  label="Height (cm)"
                >
                  <InputNumber min={0} step={0.01} precision={2} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name={['dimensions', 'depth']}
                  label="Depth (cm)"
                >
                  <InputNumber min={0} step={0.01} precision={2} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Tags</Divider>
            <Form.Item name="tags" label="Tags">
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Enter tags"
                tokenSeparators={[',']}
              />
            </Form.Item>

            <Divider orientation="left">Product Information</Divider>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="warrantyInformation"
                  label="Warranty Information"
                >
                  <Input placeholder="Enter warranty information" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="shippingInformation"
                  label="Shipping Information"
                >
                  <Input placeholder="Enter shipping information" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="returnPolicy"
                  label="Return Policy"
                >
                  <Input placeholder="Enter return policy" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Images</Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="thumbnail"
                  label="Thumbnail URL"
                  rules={[{ required: true, message: 'Please enter thumbnail URL' }]}
                >
                  <Input placeholder="Enter thumbnail URL" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="images"
                  label="Image URLs (one per line)"
                >
                  <TextArea
                    rows={4}
                    placeholder="Enter image URLs, one per line"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Flex justify="end">
                  <Space>
                    <Button
                      onClick={() => navigate(isEditMode ? `/product/${id}` : '/product')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      {isEditMode ? 'Update Product' : 'Create Product'}
                    </Button>
                  </Space>
                </Flex>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default ProductEdit;