/**
 * 企业认证后首页 - 仪表盘
 * 创建时间: 2026-03-23
 * 功能: 展示认证后企业的完整信息、智能推荐、快捷操作等
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Statistic,
  Badge,
  Button,
  List,
  Avatar,
  Typography,
  Tag,
  Space,
  Divider,
  Skeleton,
  Empty,
  message,
} from 'antd';
import {
  FileTextOutlined,
  ToolOutlined,
  BankOutlined,
  SafetyOutlined,
  IdcardOutlined,
  AuditOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  FireOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useEnterprisePortal } from '../../../context/EnterprisePortalContext';
import type { Notification, QuickAction, RecommendationItem } from '../../../types/enterprise-portal';
import './styles.css';

const { Title, Text, Paragraph } = Typography;

/**
 * 快捷操作按钮组件
 */
const QuickActionButton: React.FC<{ action: QuickAction; onClick: () => void }> = ({ action, onClick }) => (
  <Card
    hoverable
    className="quick-action-card"
    onClick={onClick}
    bodyStyle={{ padding: '16px', textAlign: 'center' }}
  >
    <Badge count={action.badge} overflowCount={99}>
      <div className="quick-action-icon">
        {getIconComponent(action.icon)}
      </div>
    </Badge>
    <div className="quick-action-name">{action.name}</div>
  </Card>
);

/**
 * 根据图标名称获取组件
 */
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    FileTextOutlined: <FileTextOutlined />,
    ToolOutlined: <ToolOutlined />,
    BankOutlined: <BankOutlined />,
    SafetyOutlined: <SafetyOutlined />,
    IdcardOutlined: <IdcardOutlined />,
    AuditOutlined: <AuditOutlined />,
  };
  return iconMap[iconName] || <StarOutlined />;
};

/**
 * 通知项组件
 */
const NotificationItem: React.FC<{
  notification: Notification;
  onClick: () => void;
}> = ({ notification, onClick }) => {
  const typeColors: Record<string, string> = {
    audit: 'blue',
    recommendation: 'green',
    system: 'orange',
    reminder: 'purple',
  };

  const typeTexts: Record<string, string> = {
    audit: '审核',
    recommendation: '推荐',
    system: '系统',
    reminder: '提醒',
  };

  return (
    <List.Item
      className={`notification-item ${!notification.read ? 'unread' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            size={36}
            style={{
              backgroundColor: !notification.read ? '#F0F5FF' : '#F5F5F5',
              borderRadius: 4,
              color: !notification.read ? '#1A5FB4' : '#999999',
            }}
            icon={<BellOutlined />}
          />
        }
        title={
          <Space>
            <Text strong={!notification.read}>{notification.title}</Text>
            <Tag color={typeColors[notification.type]}>{typeTexts[notification.type]}</Tag>
            {!notification.read && <Badge status="processing" />}
          </Space>
        }
        description={
          <Space direction="vertical" size={0}>
            <Text type="secondary" ellipsis>
              {notification.content}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatTime(notification.time)}
            </Text>
          </Space>
        }
      />
    </List.Item>
  );
};

/**
 * 格式化时间
 */
const formatTime = (time: string): string => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  
  return date.toLocaleDateString('zh-CN');
};

/**
 * 推荐卡片组件
 */
const RecommendationCard: React.FC<{
  item: RecommendationItem;
  onClick: () => void;
}> = ({ item, onClick }) => (
  <Card
    hoverable
    className="recommendation-card"
    onClick={onClick}
  >
    <div className="recommendation-header">
      <Space>
        <FireOutlined style={{ color: '#ff4d4f' }} />
        <Text strong>{item.title}</Text>
      </Space>
      <Tag color="success">已审核</Tag>
    </div>
    
    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>
      {item.description}
    </Paragraph>
    
    <div className="recommendation-tags">
      {item.tags.map(tag => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
    
    <div className="recommendation-reason">
      <Text type="secondary" style={{ fontSize: 12 }}>
        <StarOutlined style={{ color: '#faad14', marginRight: 4 }} />
        {item.reason}
      </Text>
    </div>
    
    <Divider style={{ margin: '12px 0' }} />
    
    <div className="recommendation-footer">
      <Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          浏览 {item.viewCount}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          申请 {item.applyCount}
        </Text>
      </Space>
      <Button type="link" size="small">
        {item.actionText} <ArrowRightOutlined />
      </Button>
    </div>
  </Card>
);

/**
 * 认证后首页主组件
 */
const CertifiedHome: React.FC = () => {
  const navigate = useNavigate();
  const {
    enterpriseProfile,
    certificationStatus,
    recommendations,
    notifications,
    quickActions,
    auditStatistics,
    loading,
    refreshProfile,
    refreshRecommendations,
    refreshNotifications,
    markNotificationRead,
    getAuditStatusText,
    getAuditStatusColor,
  } = useEnterprisePortal();

  // 处理快捷操作点击
  const handleQuickAction = (action: QuickAction) => {
    navigate(action.url);
  };

  // 处理通知点击
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // 处理刷新
  const handleRefresh = async () => {
    message.loading('正在刷新数据...', 0);
    await Promise.all([
      refreshProfile(),
      refreshRecommendations(),
      refreshNotifications(),
    ]);
    message.destroy();
    message.success('数据已更新');
  };

  // 未读通知数量
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading && !enterpriseProfile) {
    return (
      <div className="certified-home-container">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="certified-home-container">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              欢迎回来，{enterpriseProfile?.basicInfo.legalPerson || '企业用户'}
            </Title>
            <Text type="secondary">
              {certificationStatus?.status === 'verified' ? (
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <span>企业认证已通过</span>
                  <Tag color="success">{certificationStatus.certLevel.toUpperCase()}</Tag>
                </Space>
              ) : (
                <Space>
                  <ClockCircleOutlined style={{ color: '#faad14' }} />
                  <span>认证审核中</span>
                </Space>
              )}
            </Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新数据
          </Button>
        </div>
      </div>

      {/* 快捷操作区域 */}
      <Card className="section-card" title="快捷入口">
        <Row gutter={[16, 16]}>
          {quickActions.map(action => (
            <Col xs={12} sm={8} md={6} lg={4} key={action.id}>
              <QuickActionButton
                action={action}
                onClick={() => handleQuickAction(action)}
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* 数据概览区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="企业信用评级"
              value={enterpriseProfile?.creditRating.creditLevel || '-'}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              评分: {enterpriseProfile?.creditRating.overallScore || 0}分
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="智能推荐"
              value={recommendations?.totalCount || 0}
              suffix="项"
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              基于企业画像匹配
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理通知"
              value={unreadCount}
              suffix="条"
              prefix={<BellOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: unreadCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {unreadCount > 0 ? '有新消息待查看' : '暂无新消息'}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已审核内容"
              value={auditStatistics?.approvedCount || 0}
              suffix="/"
              prefix={<AuditOutlined style={{ color: '#52c41a' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              审核通过率: {auditStatistics ? 
                Math.round((auditStatistics.approvedCount / auditStatistics.totalCount) * 100) : 0}%
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 左侧：智能推荐 */}
        <Col xs={24} lg={16}>
          <Card
            className="section-card"
            title={
              <Space>
                <FireOutlined style={{ color: '#ff4d4f' }} />
                <span>智能推荐</span>
                <Tag color="success">已审核</Tag>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/enterprise/recommendations')}>
                查看全部
              </Button>
            }
          >
            {recommendations?.categories.map(category => (
              <div key={category.type} className="recommendation-category">
                <div className="category-header">
                  <Space>
                    {getIconComponent(category.icon)}
                    <Text strong>{category.name}</Text>
                    <Badge count={category.items.length} style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                </div>
                <Row gutter={[16, 16]}>
                  {category.items.slice(0, 2).map(item => (
                    <Col xs={24} sm={12} key={item.id}>
                      <RecommendationCard
                        item={item}
                        onClick={() => navigate(item.actionUrl)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Card>
        </Col>

        {/* 右侧：通知消息 */}
        <Col xs={24} lg={8}>
          <Card
            className="section-card"
            title={
              <Space>
                <BellOutlined />
                <span>消息通知</span>
                {unreadCount > 0 && (
                  <Badge count={unreadCount} style={{ backgroundColor: '#ff4d4f' }} />
                )}
              </Space>
            }
            extra={
              unreadCount > 0 && (
                <Button type="link" size="small">
                  全部已读
                </Button>
              )
            }
          >
            <List
              dataSource={notifications.slice(0, 5)}
              renderItem={notification => (
                <NotificationItem
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              )}
              locale={{
                emptyText: <Empty description="暂无通知消息" />,
              }}
            />
            {notifications.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Button type="link" onClick={() => navigate('/enterprise/notifications')}>
                  查看更多
                </Button>
              </div>
            )}
          </Card>

          {/* 企业画像概览 */}
          <Card
            className="section-card"
            style={{ marginTop: 16 }}
            title={
              <Space>
                <IdcardOutlined />
                <span>企业画像</span>
                <Tag color={getAuditStatusColor(enterpriseProfile?.basicInfo.auditStatus || 'pending')}>
                  {getAuditStatusText(enterpriseProfile?.basicInfo.auditStatus || 'pending')}
                </Tag>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/enterprise/profile')}>
                查看详情
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="profile-item">
                <Text type="secondary">企业名称</Text>
                <Text strong>{enterpriseProfile?.basicInfo.name}</Text>
              </div>
              <div className="profile-item">
                <Text type="secondary">所属行业</Text>
                <Text>{enterpriseProfile?.basicInfo.industry}</Text>
              </div>
              <div className="profile-item">
                <Text type="secondary">企业规模</Text>
                <Text>{enterpriseProfile?.basicInfo.scale}</Text>
              </div>
              <div className="profile-item">
                <Text type="secondary">信息完整度</Text>
                <Text style={{ color: '#52c41a' }}>
                  {enterpriseProfile?.completeness}%
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CertifiedHome;
