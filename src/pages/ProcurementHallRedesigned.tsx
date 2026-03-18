import React, { useState, useEffect } from 'react';
import { Button, List, Empty, Spin, Card, Row, Col, Input, Select, Space, Tag, Avatar, Tooltip, Rate } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined,
  EyeOutlined,
  MessageOutlined,
  HeartOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { PermissionProvider } from '../components/shared/PermissionProvider';
import { UserRole } from '../utils/permissions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import './ProcurementHallRedesigned.css';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Search } = Input;
const { Option } = Select;

// 模拟采购需求数据
const mockRequirements = [
  {
    id: '1',
    title: '高端五轴联动数控机床采购',
    description: '需要采购2台高精度五轴联动数控机床，用于航空零部件加工。要求加工精度±0.005mm，工作台尺寸不小于800×600mm，具备自动换刀功能。',
    category: '设备采购',
    budget: '200-300万元',
    region: '北京市',
    quantity: '2台',
    deadline: '2024-06-30',
    publisher: {
      id: '1',
      name: '北京航空制造有限公司',
      logo: '/api/placeholder/48/48',
      verified: true
    },
    publishTime: '2024-03-15T10:30:00Z',
    status: 'active',
    viewCount: 156,
    responseCount: 8,
    rating: 4.8,
    tags: ['数控机床', '五轴联动', '航空制造'],
    urgent: true,
    hot: true
  },
  {
    id: '2',
    title: '智慧园区综合管理平台解决方案',
    description: '需要建设智慧园区综合管理平台，包括安防监控、能耗管理、设备运维、访客管理等功能模块。要求支持移动端应用，具备数据分析和报表功能。',
    category: '技术采购',
    budget: '80-120万元',
    region: '上海市',
    quantity: '1套',
    deadline: '2024-08-15',
    publisher: {
      id: '2',
      name: '上海科技园区管理公司',
      logo: '/api/placeholder/48/48',
      verified: true
    },
    publishTime: '2024-03-14T14:20:00Z',
    status: 'active',
    viewCount: 89,
    responseCount: 12,
    rating: 4.6,
    tags: ['智慧园区', '管理平台', '物联网'],
    urgent: false,
    hot: false
  },
  {
    id: '3',
    title: '锂电池湿法隔膜生产线设备',
    description: '采购锂电池湿法隔膜生产线全套设备，包括挤出机、拉伸机、分切机等。要求产能达到年产5000万平方米，产品厚度精度±1μm。',
    category: '设备采购',
    budget: '1000-1500万元',
    region: '广东省',
    quantity: '1条生产线',
    deadline: '2024-12-31',
    publisher: {
      id: '3',
      name: '深圳新能源材料有限公司',
      logo: '/api/placeholder/48/48',
      verified: true
    },
    publishTime: '2024-03-13T09:15:00Z',
    status: 'active',
    viewCount: 234,
    responseCount: 15,
    rating: 4.9,
    tags: ['锂电池', '隔膜', '生产线设备'],
    urgent: false,
    hot: true
  }
];

// 采购分类数据
const procurementCategories = [
  { id: 'equipment', name: '设备采购', icon: '🔧', count: 456, color: '#1890ff' },
  { id: 'service', name: '服务采购', icon: '🛠️', count: 234, color: '#52c41a' },
  { id: 'material', name: '物资采购', icon: '📦', count: 345, color: '#fa8c16' },
  { id: 'technology', name: '技术采购', icon: '💡', count: 123, color: '#722ed1' },
  { id: 'construction', name: '工程采购', icon: '🏗️', count: 89, color: '#13c2c2' },
  { id: 'logistics', name: '物流采购', icon: '🚚', count: 167, color: '#eb2f96' },
  { id: 'finance', name: '金融采购', icon: '💳', count: 78, color: '#f5222d' },
  { id: 'other', name: '其他采购', icon: '📋', count: 234, color: '#faad14' }
];

const ProcurementHallRedesigned: React.FC = () => {
  const [requirements, setRequirements] = useState(mockRequirements);
  const [loading, setLoading] = useState(false);
  const [userRole] = useState<UserRole>('supplier');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');

  // 渲染统计卡片
  const renderStatCard = (title: string, value: string, trend: string, icon: string, color: string) => (
    <Card className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-content">
        <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
          <span className="icon-emoji">{icon}</span>
        </div>
        <div className="stat-info">
          <div className="stat-value">{value}</div>
          <div className="stat-title">{title}</div>
          <div className="stat-trend" style={{ color: trend.startsWith('+') ? '#52c41a' : '#ff4d4f' }}>
            {trend}
          </div>
        </div>
      </div>
    </Card>
  );

  // 渲染分类卡片
  const renderCategoryCard = (category: any) => (
    <Card 
      key={category.id}
      className="category-card"
      hoverable
      onClick={() => setSelectedCategory(category.id)}
      style={{ borderLeft: `4px solid ${category.color}` }}
    >
      <div className="category-content">
        <div className="category-icon" style={{ backgroundColor: `${category.color}15` }}>
          <span className="icon-emoji">{category.icon}</span>
        </div>
        <div className="category-info">
          <h4 className="category-name">{category.name}</h4>
          <div className="category-count">{category.count} 个需求</div>
        </div>
      </div>
    </Card>
  );

  // 渲染采购需求卡片
  const renderRequirementCard = (requirement: any) => (
    <Card key={requirement.id} className="requirement-card" hoverable>
      {/* 卡片头部 */}
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
              {dayjs(requirement.publishTime).fromNow()}
            </span>
          </div>
        </div>
        <div className="requirement-badges">
          {requirement.urgent && (
            <Tag color="red" icon={<ThunderboltOutlined />}>紧急</Tag>
          )}
          {requirement.hot && (
            <Tag color="orange" icon={<FireOutlined />}>热门</Tag>
          )}
          <Tag color="blue">{requirement.status === 'active' ? '招募中' : '已关闭'}</Tag>
        </div>
      </div>

      {/* 需求内容 */}
      <div className="requirement-content">
        <h3 className="requirement-title">
          📋 采购需求：{requirement.title}
        </h3>
        <p className="requirement-description">
          {requirement.description}
        </p>
        
        {/* 关键信息 */}
        <div className="key-info-grid">
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
            <span className="info-label">交期：</span>
            <span className="info-value">{requirement.deadline}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <span className="info-label">数量：</span>
            <span className="info-value">{requirement.quantity}</span>
          </div>
        </div>
      </div>

      {/* 标签 */}
      <div className="tags-section">
        <Tag color="blue">{requirement.category}</Tag>
        {requirement.tags.map((tag: string, index: number) => (
          <Tag key={index} color="orange">{tag}</Tag>
        ))}
      </div>

      {/* 底部统计和操作 */}
      <div className="card-footer">
        <div className="stats-info">
          <Space split={<span className="divider">|</span>}>
            <span className="stat-item">
              <EyeOutlined /> {requirement.viewCount} 次浏览
            </span>
            <span className="stat-item">
              <MessageOutlined /> {requirement.responseCount} 家响应
            </span>
            <span className="stat-item">
              <Rate disabled defaultValue={requirement.rating} style={{ fontSize: 12 }} />
              <span style={{ marginLeft: 4 }}>{requirement.rating}</span>
            </span>
          </Space>
        </div>
        <div className="action-buttons">
          <Space>
            <Button type="primary" icon={<MessageOutlined />}>
              立即对接
            </Button>
            <Button icon={<HeartOutlined />}>
              收藏
            </Button>
            <Button icon={<PhoneOutlined />}>
              咨询
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );

  return (
    <PermissionProvider userRole={userRole}>
      <div className="procurement-hall-redesigned">
        {/* 顶部横幅区域 */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">智能采购中心</h1>
              <p className="hero-description">企业采购需求发布与精准撮合平台</p>
              <div className="hero-actions">
                <Button type="primary" size="large" icon={<PlusOutlined />}>
                  发布采购需求
                </Button>
                <Button size="large">我的采购</Button>
                <Button size="large">消息中心</Button>
              </div>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div className="stats-section">
            <Row gutter={[24, 24]}>
              <Col xs={12} sm={6}>
                {renderStatCard('活跃需求', '1,280+', '+12%', '📋', '#1890ff')}
              </Col>
              <Col xs={12} sm={6}>
                {renderStatCard('注册供应商', '8,960+', '+8%', '🏭', '#52c41a')}
              </Col>
              <Col xs={12} sm={6}>
                {renderStatCard('成功撮合', '3,420+', '+15%', '🤝', '#fa8c16')}
              </Col>
              <Col xs={12} sm={6}>
                {renderStatCard('交易金额', '¥2.8亿+', '+25%', '💰', '#722ed1')}
              </Col>
            </Row>
          </div>
        </div>

        {/* 采购分类 */}
        <div className="categories-section">
          <h2 className="section-title">采购分类</h2>
          <Row gutter={[16, 16]}>
            {procurementCategories.map((category) => (
              <Col key={category.id} xs={12} sm={8} md={6} lg={3}>
                {renderCategoryCard(category)}
              </Col>
            ))}
          </Row>
        </div>

        {/* 筛选工具栏 */}
        <div className="filter-section">
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Search
                  placeholder="搜索采购需求、供应商、产品..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onSearch={(value) => console.log('搜索:', value)}
                  size="large"
                />
              </Col>
              <Col xs={8} sm={4}>
                <Select
                  placeholder="采购类型"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="all">全部类型</Option>
                  <Option value="equipment">设备采购</Option>
                  <Option value="service">服务采购</Option>
                  <Option value="material">物资采购</Option>
                </Select>
              </Col>
              <Col xs={8} sm={4}>
                <Select
                  placeholder="地区"
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="all">全部地区</Option>
                  <Option value="beijing">北京市</Option>
                  <Option value="shanghai">上海市</Option>
                  <Option value="guangdong">广东省</Option>
                </Select>
              </Col>
              <Col xs={8} sm={4}>
                <Select
                  placeholder="预算范围"
                  value={selectedBudget}
                  onChange={setSelectedBudget}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="all">全部预算</Option>
                  <Option value="low">50万以下</Option>
                  <Option value="medium">50-200万</Option>
                  <Option value="high">200万以上</Option>
                </Select>
              </Col>
              <Col xs={24} sm={4}>
                <Space>
                  <Button icon={<FilterOutlined />}>高级筛选</Button>
                  <Button>重置</Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>

        {/* 采购需求列表 */}
        <div className="requirements-section">
          <div className="section-header">
            <h2 className="section-title">最新采购需求</h2>
            <Select defaultValue="latest" style={{ width: 120 }}>
              <Option value="latest">最新发布</Option>
              <Option value="deadline">即将截止</Option>
              <Option value="budget">预算最高</Option>
              <Option value="popular">最受欢迎</Option>
            </Select>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : requirements.length > 0 ? (
            <div className="requirements-list">
              {requirements.map(renderRequirementCard)}
            </div>
          ) : (
            <Empty
              description="暂无采购需求"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" icon={<PlusOutlined />}>
                发布第一个采购需求
              </Button>
            </Empty>
          )}
        </div>
      </div>
    </PermissionProvider>
  );
};

export default ProcurementHallRedesigned;
