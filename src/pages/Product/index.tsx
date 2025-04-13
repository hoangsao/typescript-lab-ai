import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  List,
  Typography,
  Button,
  Space,
  Pagination,
  message,
  Rate,
  Tag,
  Tooltip,
  Divider,
  Flex,
  Popconfirm
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProductsApi, deleteProductApi } from '../../apis/productApi';
import { Product } from '../../models/product';
import './index.scss';

const { Title, Text, Paragraph } = Typography;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getProductsApi(page, pageSize);
      if (response.success && response.data) {
        setProducts(response.data.items);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.data.pagination.totalItems,
        });
      } else {
        messageApi.error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      messageApi.error('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  const handlePageChange = (page: number, pageSize?: number) => {
    fetchProducts(page, pageSize || pagination.pageSize);
  };

  const handleView = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleEdit = (productId: number) => {
    navigate(`/product/${productId}/edit`);
  };

  const handleDelete = async (productId: number) => {
    if (!productId) {
      return;
    }

    try {
      const response = await deleteProductApi(productId);
      if (response.success) {
        messageApi.success('Product deleted successfully');
        fetchProducts(pagination.current, pagination.pageSize);
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
      <div style={{ marginTop: '8px' }}>
        {tags.slice(0, 3).map((tag) => (
          <Tag key={tag} color="blue" style={{ marginRight: '4px' }}>
            {tag}
          </Tag>
        ))}
        {tags.length > 3 && (
          <Tooltip title={tags.slice(3).join(', ')}>
            <Tag color="blue">+{tags.length - 3}</Tag>
          </Tooltip>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
  }, []);

  return (
    <>
      {contextHolder}
      <div className='product-view-container'>
        <Flex className='header-container' justify="space-between" align="center">
          <Title level={2}>Products</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/product/new')}
          >
            Add New Product
          </Button>
        </Flex>

        <List
          className="product-list-container"
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
          dataSource={products}
          loading={loading}
          renderItem={(product) => (
            <List.Item>
              <Card
                className='product-item-container'
                hoverable
                cover={
                  <div className='cover'>
                    <img
                      alt={product.title}
                      src={product.thumbnail}
                    />
                  </div>
                }
                actions={[
                  <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(product.id)}>
                    View
                  </Button>,
                  <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(product.id)}>
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Are you sure you want to delete this product?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDelete(product.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  className='product-item-content'
                  title={
                    <Tooltip title={product.title}>
                      <div className='title'>
                        {product.title}
                      </div>
                    </Tooltip>
                  }
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
                      <Space direction="vertical" size={2} style={{ width: '100%' }}>
                        <div>
                          <Text type="secondary">Brand: </Text>
                          <Text>{product.brand}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Category: </Text>
                          <Tag color="green">{product.category}</Tag>
                        </div>
                        {renderTags(product.tags)}
                        <div>
                          <Text type="secondary">Rating: </Text>
                          <Rate disabled defaultValue={product.rating || 0} allowHalf style={{ fontSize: '14px' }} />
                          <Text style={{ marginLeft: '5px' }}>{product.rating?.toFixed(1)}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Stock: </Text>
                          <Text
                            style={{ color: product.stock <= 5 ? '#ff4d4f' : undefined }}
                          >
                            {product.stock}
                          </Text>
                          {product.stock <= 5 && (
                            <Tag color="red" style={{ marginLeft: '5px' }}>Low Stock</Tag>
                          )}
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                        <div>
                          <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                            ${product.price.toFixed(2)}
                          </Text>
                          {product.discountPercentage && (
                            <Text type="secondary" style={{ marginLeft: '8px', textDecoration: 'line-through' }}>
                              ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </Text>
                          )}
                          {product.discountPercentage && (
                            <Tag color="red" style={{ marginLeft: '5px' }}>
                              {product.discountPercentage}% OFF
                            </Tag>
                          )}
                        </div>
                      </Space>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />

        <div className='pagination-container'>
          <Pagination
            className='pagination'
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['8', '10', '20', '50']}
            showTotal={(total) => `Total ${total} items`}
          />
        </div>
      </div>
    </>
  );
};

export default Products;