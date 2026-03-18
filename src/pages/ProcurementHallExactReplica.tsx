import React, { useState } from 'react';
import { Button, Card, Row, Col, Input, Select, Space, Tag, Avatar, Rate, Divider } from 'antd';
import { 
  SearchOutlined, 
  HeartOutlined,
  MessageOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  StarOutlined
} from '@ant-design/icons';
import { PermissionProvider } from '../components/shared/PermissionProvider';
import { UserRole } from '../utils/permissions';
import './ProcurementHallExactReplica.css';

const { Search } = Input;
const { Option } = Select;

// 模拟采购需求数据
const mockRequirements = [
  {
    id: '1',
    title: '高端五轴联动数控机床采购',
    company: '北京航空制造有限公司',
    avatar: '/api/placeholder/40/40',
    verified: true,
    description: '需要采购2台高精度五轴联动数控机床，用于航空零部件加工。要求加工精度±0.005mm，工作台尺寸不小于800×600mm。',
    budget: '200-300万元',
    region: '北京市',
    deadline: '2024-06-30',
    category: '设备采购',
    tags: ['数控机床', '五轴联动', '航空制造'],
    viewCount: 156,
    responseCount: 8,
    rating: 4.8,
    isOnline: true
  },
  {
    id: '2',
    title: '智慧园区综合管理平台解决方案',
    company: '上海科技园区管理公司',
    avatar: '/api/placeholder/40/40',
    verified: true,
    description: '需要建设智慧园区综合管理平台，包括安防监控、能耗管理、设备运维、访客管理等功能模块。',
    budget: '80-120万元',
    region: '上海市',
    deadline: '2024-08-15',
    category: '技术采购',
    tags: ['智慧园区', '管理平台', '物联网'],
    viewCount: 89,
    responseCount: 12,
    rating: 4.6,
    isOnline: false
  }
];

const ProcurementHallExactReplica: React.FC = () => {
  const [userRole] = useState<UserRole>('supplier');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 渲染需求卡片 - 完全按照业务大厅的服务卡片风格
  const renderRequirementCard = (requirement: any) => (
    <Card key={requirement.id} className="requirement-service-card">
      <div className="card-header">
        <div className="company-info">
          <Avatar src={requirement.avatar} size={40} />
          <div className="company-details">
            <div className="company-name">
              <span>{requirement.company}</span>
              {requirement.verified && (
                <CheckCircleOutlined className="verified-badge" />
              )}
              {requirement.isOnline && (
                <Tag color="green" size="small" className="online-status">在线</Tag>
              )}
            </div>
            <div className="company-meta">
              <span className="category-tag">{requirement.category}</span>
              <span className="region-tag">📍 {requirement.region}</span>
            </div>
          </div>
        </div>
        <div className="rating-section">
          <Rate disabled defaultValue={requirement.rating} style={{ fontSize: 12 }} />
          <span className="rating-text">{requirement.rating} ({requirement.responseCount}条响应)</span>
        </div>
      </div>

      <div className="service-content">
        <h3 className="service-title">{requirement.title}</h3>
        <p className="service-description">{requirement.description}</p>
        
        <div className="service-highlights">
          <div className="highlight-item">
            <span className="highlight-label">预算范围：</span>
            <span className="highlight-value">{requirement.budget}</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-label">期望交期：</span>
            <span className="highlight-value">{requirement.deadline}</span>
          </div>
        </div>
      </div>

      <div className="tags-section">
        {requirement.tags.map((tag: string, index: number) => (
          <Tag key={index} className="service-tag">{tag}</Tag>
        ))}
      </div>

      <div className="card-footer">
        <div className="stats-section">
          <Space split={<Divider type="vertical" />}>
            <span className="stat-item">
              <EyeOutlined /> {requirement.viewCount}
            </span>
            <span className="stat-item">
              <StarOutlined /> {requirement.rating}
            </span>
            <span className="stat-item">
              <MessageOutlined /> {requirement.responseCount}条响应
            </span>
          </Space>
        </div>
        <div className="action-buttons">
          <Space>
            <Button type="primary" size="large">立即对接</Button>
            <Button icon={<PhoneOutlined />}>在线咨询</Button>
            <Button icon={<HeartOutlined />}>收藏</Button>
          </Space>
        </div>
      </div>
    </Card>
  );

  return (
    <PermissionProvider userRole={userRole}>
      <div className="procurement-hall-replica">
        {/* 顶部横幅 - 完全按照业务大厅风格 */}
        <div className="hall-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="hall-title">采购大厅</h1>
              <p className="hall-subtitle">企业采购需求发布与撮合平台</p>
            </div>
            <div className="quick-actions">
              <Button type="primary" size="large">发布需求</Button>
            </div>
          </div>
          
          {/* 统计数据卡片 - 完全按照业务大厅风格 */}
          <div className="stats-container">
            <Row gutter={[24, 24]}>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-info">
                    <div className="stat-number">1,280+</div>
                    <div className="stat-label">活跃需求</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <div className="stat-icon">🏭</div>
                  <div className="stat-info">
                    <div className="stat-number">8,960+</div>
                    <div className="stat-label">注册供应商</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <div className="stat-icon">🤝</div>
                  <div className="stat-info">
                    <div className="stat-number">3,420+</div>
                    <div className="stat-label">成功撮合</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-number">¥2.8亿+</div>
                    <div className="stat-label">交易金额</div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* 服务分类 - 完全按照业务大厅的8个分类风格 */}
        <div className="categories-section">
          <h2 className="section-title">采购分类</h2>
          <div className="categories-grid">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">🔧</div>
                  <div className="category-name">设备采购</div>
                  <div className="category-desc">生产设备、检测设备</div>
                </div>
              </Col>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">🛠️</div>
                  <div className="category-name">服务采购</div>
                  <div className="category-desc">技术服务、咨询服务</div>
                </div>
              </Col>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">📦</div>
                  <div className="category-name">物资采购</div>
                  <div className="category-desc">原材料、零部件</div>
                </div>
              </Col>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">💡</div>
                  <div className="category-name">技术采购</div>
                  <div className="category-desc">专利技术、解决方案</div>
                </div>
              </Col>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">🏗️</div>
                  <div className="category-name">工程采购</div>
                  <div className="category-desc">建筑工程、装修工程</div>
                </div>
              </Col>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">🚚</div>
                  <div className="category-name">物流采购</div>
                  <div className="category-desc">运输服务、仓储服务</div>
                </div>
              </Col>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">💳</div>
                  <div className="category-name">金融采购</div>
                  <div className="category-desc">融资服务、保险服务</div>
                </div>
              </Col>
              <Col xs={12} sm={8} md={6} lg={3}>
                <div className="category-item">
                  <div className="category-icon">📋</div>
                  <div className="category-name">其他采购</div>
                  <div className="category-desc">综合采购需求</div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* 搜索和筛选 - 完全按照业务大厅风格 */}
        <div className="search-filter-section">
          <div className="search-container">
            <Search
              placeholder="搜索采购需求、供应商、产品..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              size="large"
              style={{ maxWidth: 400 }}
            />
          </div>
          <div className="filter-container">
            <Space>
              <Select placeholder="全部类型" style={{ width: 120 }}>
                <Option value="all">全部类型</Option>
                <Option value="equipment">设备采购</Option>
                <Option value="service">服务采购</Option>
              </Select>
              <Select placeholder="全部地区" style={{ width: 120 }}>
                <Option value="all">全部地区</Option>
                <Option value="beijing">北京市</Option>
                <Option value="shanghai">上海市</Option>
              </Select>
              <Select placeholder="排序" style={{ width: 100 }}>
                <Option value="latest">最新</Option>
                <Option value="popular">最热</Option>
              </Select>
            </Space>
          </div>
        </div>

        {/* 需求列表 - 完全按照业务大厅的服务列表风格 */}
        <div className="requirements-section">
          <h2 className="section-title">最新采购需求</h2>
          <div className="requirements-list">
            {mockRequirements.map(renderRequirementCard)}
          </div>
        </div>
      </div>
    </PermissionProvider>
  );
};

export default ProcurementHallExactReplica;
