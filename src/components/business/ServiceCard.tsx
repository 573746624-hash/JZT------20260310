import React from 'react';
import { Card, Tag, Avatar, Button, Space, Rate, Tooltip } from 'antd';
import { 
  EyeOutlined, 
  HeartOutlined, 
  MessageOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import './ServiceCard.css';

interface Provider {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  experience: string;
  location: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  provider: Provider;
  price: string;
  region: string;
  period: string;
  description: string;
  advantages: string[];
  rating: number;
  reviewCount: number;
  viewCount: number;
  tags: string[];
  images?: string[];
  isOnline: boolean;
}

interface ServiceCardProps {
  service: Service;
  userRole: 'buyer' | 'supplier' | 'operator' | 'guest';
  onContact?: (service: Service) => void;
  onFavorite?: (service: Service) => void;
  onShare?: (service: Service) => void;
  onViewDetails?: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  userRole,
  onContact,
  onFavorite,
  onShare,
  onViewDetails
}) => {
  const renderActions = () => {
    switch (userRole) {
      case 'buyer':
        return (
          <Space>
            <Button type="primary" size="large" icon={<MessageOutlined />} onClick={() => onContact?.(service)}>
              立即对接
            </Button>
            <Button icon={<PhoneOutlined />} onClick={() => {}}>
              在线咨询
            </Button>
            <Button icon={<HeartOutlined />} onClick={() => onFavorite?.(service)}>
              收藏
            </Button>
            <Button icon={<ShareAltOutlined />} onClick={() => onShare?.(service)}>
              分享
            </Button>
          </Space>
        );
      
      case 'supplier':
        return (
          <Space>
            <Button onClick={() => onViewDetails?.(service)}>
              查看详情
            </Button>
            <Button icon={<HeartOutlined />} onClick={() => onFavorite?.(service)}>
              收藏
            </Button>
            <Button icon={<ShareAltOutlined />} onClick={() => onShare?.(service)}>
              分享
            </Button>
          </Space>
        );
      
      case 'operator':
        return (
          <Space>
            <Button type="primary" onClick={() => {}}>
              推荐服务
            </Button>
            <Button onClick={() => {}}>
              查看数据
            </Button>
            <Button type="link" onClick={() => onViewDetails?.(service)}>
              查看详情
            </Button>
          </Space>
        );
      
      default:
        return (
          <Button disabled>
            请登录后操作
          </Button>
        );
    }
  };

  return (
    <Card className="service-card" hoverable>
      {/* 卡片头部：服务商信息 */}
      <div className="card-header">
        <div className="provider-info">
          <Avatar src={service.provider.logo} size={48} />
          <div className="provider-details">
            <div className="provider-name">
              <span>{service.provider.name}</span>
              {service.provider.verified && (
                <Tooltip title="已认证企业">
                  <CheckCircleOutlined className="verified-icon" />
                </Tooltip>
              )}
              {service.isOnline && (
                <Tag color="green" className="online-tag">在线</Tag>
              )}
            </div>
            <div className="provider-meta">
              <span className="experience">{service.provider.experience}</span>
              <span className="location">📍 {service.provider.location}</span>
            </div>
          </div>
        </div>
        <div className="service-rating">
          <Rate disabled defaultValue={service.rating} style={{ fontSize: 14 }} />
          <span className="rating-text">
            {service.rating} ({service.reviewCount}条评价)
          </span>
        </div>
      </div>

      {/* 服务信息 */}
      <div className="service-content">
        <h3 className="service-name">{service.name}</h3>
        <p className="service-description">{service.description}</p>
        
        {/* 服务优势 */}
        {service.advantages.length > 0 && (
          <div className="service-advantages">
            <h4>服务优势：</h4>
            <ul>
              {service.advantages.slice(0, 3).map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 关键信息展示 */}
        <div className="key-info">
          <div className="info-item">
            <span className="info-icon">💰</span>
            <span className="info-label">价格：</span>
            <span className="info-value">{service.price}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <span className="info-label">服务地区：</span>
            <span className="info-value">{service.region}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⏱️</span>
            <span className="info-label">服务周期：</span>
            <span className="info-value">{service.period}</span>
          </div>
        </div>
      </div>

      {/* 标签系统 */}
      <div className="tags-section">
        <Tag color="blue">{service.category}</Tag>
        {service.tags.map((tag, index) => (
          <Tag key={index} color="orange">{tag}</Tag>
        ))}
      </div>

      {/* 操作区域 */}
      <div className="actions-section">
        {renderActions()}
      </div>

      {/* 统计信息 */}
      <div className="stats-section">
        <Space split={<span className="divider">|</span>}>
          <span className="stat-item">
            <EyeOutlined /> {service.viewCount} 次浏览
          </span>
          <span className="stat-item">
            <StarOutlined /> {service.rating} 分
          </span>
          <span className="stat-item">
            <MessageOutlined /> {service.reviewCount} 条评价
          </span>
        </Space>
      </div>
    </Card>
  );
};

export default ServiceCard;
