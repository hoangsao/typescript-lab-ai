import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Space,
  Image,
  Descriptions,
  Rate,
  Tag,
  Divider,
  message,
  Spin,
  Row,
  Col,
  List,
  Avatar,
  Flex,
  Popconfirm
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { getProductByIdApi, deleteProductApi } from '../../apis/productApi';
import { Product, Review } from '../../models/product';

const { Title, Text, Paragraph } = Typography;

// Custom Review component (compatible with Ant Design v5)
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
  <div style={{ marginBottom: '16px' }}>
    <Flex align="start" gap={12}>
      <Avatar icon={<UserOutlined />} />
      <div style={{ flex: 1 }}>
        <Flex vertical gap={4}>
          <Text strong>{review.reviewerName}</Text>
          <div>
            <Rate disabled allowHalf defaultValue={review.rating} style={{ fontSize: '12px' }} />
            <Text type="secondary" style={{ marginLeft: '10px' }}>
              {new Date(review.date).toLocaleDateString()}
            </Text>
          </div>
          <Paragraph>{review.comment}</Paragraph>
        </Flex>
      </div>
    </Flex>
  </div>
);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getProductByIdApi(parseInt(id));
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        messageApi.error(response.message || 'Failed to fetch product details');
        navigate('/product');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      messageApi.error('An error occurred while fetching product details');
      navigate('/product');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, messageApi]);

  const handleDelete = async () => {
    if (!product) return;

    try {
      const response = await deleteProductApi(product.id);
      if (response.success) {
        messageApi.success('Product deleted successfully');
        navigate('/product');
      } else {
        messageApi.error(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      messageApi.error('An error occurred while deleting the product');
    }
  };

  const renderTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;

    return (
      <Flex wrap="wrap" gap={4}>
        {tags.map((tag) => (
          <Tag key={tag} color="blue">
            {tag}
          </Tag>
        ))}
      </Flex>
    );
  };

  useEffect(() => {
    fetchProduct();
  }, [id, fetchProduct]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Product not found</Title>
        <Button type="primary" onClick={() => navigate('/product')}>
          Back to Products
        </Button>
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
            onClick={() => navigate('/product')}
          >
            Back to Products
          </Button>
        </div>

        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={10} lg={8}>
              <Image
                src={product.thumbnail}
                alt={product.title}
                style={{ width: '100%', objectFit: 'contain' }}
              />

              {product.images && product.images.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <Divider orientation="left">Product Gallery</Divider>
                  <Image.PreviewGroup>
                    <Row gutter={[8, 8]}>
                      {product.images.map((image, index) => (
                        <Col span={8} key={index}>
                          <Image
                            src={image}
                            alt={`${product.title} - ${index + 1}`}
                            style={{ objectFit: 'cover', height: '80px', width: '100%' }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Image.PreviewGroup>
                </div>
              )}
            </Col>

            <Col xs={24} sm={24} md={14} lg={16}>
              <Flex justify="space-between" align="flex-start">
                <Title level={2}>{product.title}</Title>
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/product/${product.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this product?"
                    description="This action cannot be undone."
                    onConfirm={handleDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />} >Delete</Button>
                  </Popconfirm>
                </Space>
              </Flex>

              <Divider />

              <Descriptions column={{ xs: 1, sm: 2 }} layout="vertical">
                <Descriptions.Item label="Price">
                  <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
                    ${product.price.toFixed(2)}
                  </Text>
                  {product.discountPercentage && (
                    <>
                      <Text type="secondary" style={{ marginLeft: '10px', textDecoration: 'line-through' }}>
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                      </Text>
                      <Tag color="red" style={{ marginLeft: '10px' }}>
                        {product.discountPercentage}% OFF
                      </Tag>
                    </>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Rating">
                  <Rate disabled allowHalf defaultValue={product.rating || 0} />
                  <Text style={{ marginLeft: '10px' }}>
                    {product.rating ? product.rating.toFixed(1) : 'No rating'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Brand">
                  <Text>{product.brand}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  <Tag color="green">{product.category}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Stock">
                  <Text>{product.stock}</Text>
                  {product.stock <= 5 && (
                    <Tag color="red" style={{ marginLeft: '10px' }}>
                      Low Stock
                    </Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="SKU">
                  <Text>{product.sku}</Text>
                </Descriptions.Item>
                {product.weight && (
                  <Descriptions.Item label="Weight">
                    <Text>{product.weight} kg</Text>
                  </Descriptions.Item>
                )}
                {product.minimumOrderQuantity && (
                  <Descriptions.Item label="Minimum Order Quantity">
                    <Text>{product.minimumOrderQuantity}</Text>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {product.dimensions && (
                <>
                  <Divider orientation="left">Dimensions</Divider>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Text type="secondary">Width: </Text>
                      <Text>{product.dimensions.width} cm</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Height: </Text>
                      <Text>{product.dimensions.height} cm</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Depth: </Text>
                      <Text>{product.dimensions.depth} cm</Text>
                    </Col>
                  </Row>
                </>
              )}

              <Divider orientation="left">Description</Divider>
              <Paragraph>{product.description}</Paragraph>

              {renderTags(product.tags)}

              {(product.warrantyInformation || product.shippingInformation || product.returnPolicy) && (
                <>
                  <Divider orientation="left">Additional Information</Divider>
                  <Row gutter={[16, 16]}>
                    {product.warrantyInformation && (
                      <Col xs={24} sm={8}>
                        <Card size="small" title="Warranty">
                          {product.warrantyInformation}
                        </Card>
                      </Col>
                    )}
                    {product.shippingInformation && (
                      <Col xs={24} sm={8}>
                        <Card size="small" title="Shipping">
                          {product.shippingInformation}
                        </Card>
                      </Col>
                    )}
                    {product.returnPolicy && (
                      <Col xs={24} sm={8}>
                        <Card size="small" title="Return Policy">
                          {product.returnPolicy}
                        </Card>
                      </Col>
                    )}
                  </Row>
                </>
              )}

              {product.reviews && product.reviews.length > 0 && (
                <>
                  <Divider orientation="left">Customer Reviews</Divider>
                  <List
                    itemLayout="vertical"
                    dataSource={product.reviews}
                    renderItem={(review) => (
                      <ReviewItem review={review} />
                    )}
                  />
                </>
              )}

              {product.meta && (
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
                  <Text type="secondary">
                    Last updated: {new Date(product.meta.updatedAt).toLocaleString()}
                  </Text>
                </div>
              )}
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default ProductDetail;