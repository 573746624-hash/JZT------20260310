import React from 'react';
import { Card, Tag, Avatar, Button, Space, Tooltip } from 'antd';
import { 
  EyeOutlined, 
  HeartOutlined, 
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
import './RequirementCard.css';

interface Publisher {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
}

interface Requirement {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  region: string;
  quantity: string;
  deadline: string;
  publisher: Publisher;
  publishTime: string;
  status: 'active' | 'closed' | 'completed';
  viewCount: number;
  responseCount: number;
  tags: string[];
  urgent?: boolean;
}

interface RequirementCardProps {
  requirement: Requirement;
  userRole: 'buyer' | 'supplier' | 'operator' | 'guest';
  onEdit?: (requirement: Requirement) => void;
  onDelete?: (requirement: Requirement) => void;
  onContact?: (requirement: Requirement) => void;
  onFavorite?: (requirement: Requirement) => void;
  onApprove?: (requirement: Requirement) => void;
}

const RequirementCard: React.FC<RequirementCardProps> = ({
  requirement,
  userRole,
  onEdit,
  onDelete,
  onContact,
  onFavorite,
  onApprove
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'green', text: '招募中', icon: <ClockCircleOutlined /> };
      case 'closed':
        return { color: 'orange', text: '已关闭', icon: <ClockCircleOutlined /> };
      case 'completed':
        return { color: 'blue', text: '已完成', icon: <CheckCircleOutlined /> };
      default:
        return { color: 'default', text: '未知', icon: null };
    }
  };

  const statusConfig = getStatusConfig(requirement.status);

  const renderActions = () => {
    switch (userRole) {
      case 'buyer':
        return (
          <Space>
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit?.(requirement)}>
              编辑需求
            </Button>
            <Button type="link" size="small" onClick={() => {}}>
              查看响应 ({requirement.responseCount})
            </Button>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete?.(requirement)}>
              取消需求
            </Button>
          </Space>
        );
      
      case 'supplier':
        return (
          <Space>
            <Button type="primary" size="large" icon={<MessageOutlined />} onClick={() => onContact?.(requirement)}>
              立即对接
            </Button>
            <Button icon={<HeartOutlined />} onClick={() => onFavorite?.(requirement)}>
              收藏
            </Button>
            <Button onClick={() => {}}>
              对比
            </Button>
          </Space>
        );
      
      case 'operator':
        return (
          <Space>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => onApprove?.(requirement)}>
              审核通过
            </Button>
            <Button onClick={() => {}}>
              分配跟进人
            </Button>
            <Button type="link" onClick={() => {}}>
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
    <Card className="requirement-card" hoverable>
      {/* 卡片头部：企业信息 + 状态 */}
      <div className="card-header">
        <div className="publisher-info">
          <Avatar src={requirement.publisher.logo} size={48} />
          <div className="publisher-details">
            <div className="publisher-name">
              <span>{requirement.publisher.name}</span>
              {requirement.publisher.verified && (
                <Tooltip title="已认证企业">
                  <CheckCircleOutlined className="verified-icon" />
                </Tooltip>
              )}
            </div>
            <span className="publish-time">
              发布于 {dayjs(requirement.publishTime).fromNow()}
            </span>
          </div>
        </div>
        <div className="requirement-status">
          <Tag color={statusConfig.color} icon={statusConfig.icon}>
            {statusConfig.text}
          </Tag>
          {requirement.urgent && (
            <Tag color="red">紧急</Tag>
          )}
        </div>
      </div>

      {/* 采购需求核心内容 */}
      <div className="requirement-content">
        <h3 className="requirement-title">
          采购需求：{requirement.title}
        </h3>
        <p className="requirement-description">
          {requirement.description}
        </p>
        
        {/* 关键信息展示 */}
        <div className="key-info">
          <div className="info-item">
            <span className="info-icon">💰</span>
            <span className="info-label">预算：</span>
            <span className="info-value">{requirement.budget}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <span className="info-label">地区：</span>
            <span className="info-value">{requirement.region}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <span className="info-label">期望交期：</span>
            <span className="info-value">{requirement.deadline}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <span className="info-label">数量：</span>
            <span className="info-value">{requirement.quantity}</span>
          </div>
        </div>
      </div>

      {/* 标签系统 */}
      <div className="tags-section">
        <Tag color="blue">{requirement.category}</Tag>
        <Tag color="green">{requirement.region}</Tag>
        {requirement.tags.map((tag, index) => (
          <Tag key={index} color="orange">{tag}</Tag>
        ))}
      </div>

      {/* 操作区域 */}
      <div className="actions-section">
        {renderActions()}
      </div>

      {/* 响应统计 */}
      <div className="stats-section">
        <Space split={<span className="divider">|</span>}>
          <span className="stat-item">
            <EyeOutlined /> {requirement.viewCount} 次浏览
          </span>
          <span className="stat-item">
            <MessageOutlined /> {requirement.responseCount} 家企业已响应
          </span>
        </Space>
      </div>
    </Card>
  );
};

export default RequirementCard;
