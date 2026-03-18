import React, { useState, useEffect } from 'react';
import { Button, List, Empty, Spin } from 'antd';
import { PlusOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { PermissionProvider } from '../components/shared/PermissionProvider';
import HallPageTemplate from '../components/shared/HallPageTemplate';
import ServiceCard from '../components/business/ServiceCard';
import { UserRole } from '../utils/permissions';
import './BusinessHall.css';

// 模拟数据
const mockServices = [
  {
    id: '1',
    name: '智能制造数字化转型咨询服务',
    category: '技术服务',
    provider: {
      id: '1',
      name: '北京智造科技有限公司',
      logo: '/api/placeholder/48/48',
      verified: true,
      experience: '8年行业经验',
      location: '北京市海淀区'
    },
    price: '面议',
    region: '全国',
    period: '3-6个月',
    description: '为制造企业提供数字化转型整体解决方案，包括生产流程优化、设备联网、数据分析平台搭建等服务。已成功服务500+制造企业。',
    advantages: [
      '拥有完整的数字化转型方法论',
      '资深专家团队，平均经验10年以上',
      '提供从咨询到实施的一站式服务',
      '已获得ISO27001信息安全认证'
    ],
    rating: 4.8,
    reviewCount: 156,
    viewCount: 2340,
    tags: ['数字化转型', '智能制造', '工业4.0'],
    isOnline: true
  },
  {
    id: '2',
    name: '企业法律风险防控体系建设',
    category: '法律服务',
    provider: {
      id: '2',
      name: '上海金诚律师事务所',
      logo: '/api/placeholder/48/48',
      verified: true,
      experience: '15年专业经验',
      location: '上海市浦东新区'
    },
    price: '8-15万元',
    region: '华东地区',
    period: '2-4个月',
    description: '专业提供企业合规管理、合同风险防控、知识产权保护等法律服务。团队包括资深律师20余名，服务过众多知名企业。',
    advantages: [
      '专业律师团队，经验丰富',
      '提供7×24小时法律咨询服务',
      '建立完善的风险预警机制',
      '成功处理各类商业纠纷1000+件'
    ],
    rating: 4.9,
    reviewCount: 89,
    viewCount: 1567,
    tags: ['法律咨询', '合规管理', '风险防控'],
    isOnline: false
  },
  {
    id: '3',
    name: '财税筹划与税务优化服务',
    category: '财税服务',
    provider: {
      id: '3',
      name: '深圳华信财税咨询公司',
      logo: '/api/placeholder/48/48',
      verified: true,
      experience: '12年专业经验',
      location: '深圳市南山区'
    },
    price: '5-10万元',
    region: '华南地区',
    period: '1-3个月',
    description: '专业提供企业税务筹划、财务管理优化、税收政策解读等服务。帮助企业合理节税，提升财务管理水平。',
    advantages: [
      '资深注册会计师团队',
      '熟悉最新税收政策',
      '为企业平均节税15-30%',
      '提供持续的财税顾问服务'
    ],
    rating: 4.7,
    reviewCount: 234,
    viewCount: 3456,
    tags: ['税务筹划', '财务优化', '政策解读'],
    isOnline: true
  }
];

const BusinessHall: React.FC = () => {
  const [services, setServices] = useState(mockServices);
  const [loading, setLoading] = useState(false);
  const [userRole] = useState<UserRole>('buyer');

  // 页面配置
  const pageConfig = {
    title: '企业服务中心',
    description: '一站式企业服务平台，连接优质服务商与企业需求',
    stats: [
      {
        title: '入驻企业数',
        value: '12,580+',
        trend: '+15%',
        icon: '🏢',
        color: 'blue'
      },
      {
        title: '发布服务数',
        value: '8,960+',
        trend: '+12%',
        icon: '🛠️',
        color: 'green'
      },
      {
        title: '成功对接数',
        value: '3,420+',
        trend: '+18%',
        icon: '🤝',
        color: 'orange'
      },
      {
        title: '用户满意度',
        value: '98.5%',
        trend: '+2%',
        icon: '⭐',
        color: 'purple'
      }
    ],
    categories: [
      {
        id: 'technology',
        name: '技术服务',
        icon: '🔧',
        count: 1234,
        description: '技术开发、技术咨询、技术转让'
      },
      {
        id: 'legal',
        name: '法律服务',
        icon: '⚖️',
        count: 567,
        description: '法律咨询、合同审核、诉讼代理'
      },
      {
        id: 'finance',
        name: '财税服务',
        icon: '💰',
        count: 890,
        description: '财务代理、税务筹划、审计服务'
      },
      {
        id: 'hr',
        name: '人力资源',
        icon: '👥',
        count: 456,
        description: '招聘服务、培训服务、劳务派遣'
      },
      {
        id: 'ip',
        name: '知识产权',
        icon: '📚',
        count: 234,
        description: '专利申请、商标注册、版权登记'
      },
      {
        id: 'marketing',
        name: '市场推广',
        icon: '📢',
        count: 678,
        description: '品牌推广、营销策划、广告投放'
      },
      {
        id: 'office',
        name: '办公服务',
        icon: '🏢',
        count: 345,
        description: '办公租赁、设备采购、物业服务'
      },
      {
        id: 'financial',
        name: '金融服务',
        icon: '🏦',
        count: 123,
        description: '融资服务、贷款咨询、保险服务'
      }
    ],
    quickActions: [
      {
        label: '发布需求',
        type: 'primary' as const,
        icon: <PlusOutlined />,
        onClick: () => handlePublishRequirement()
      },
      {
        label: '我的服务',
        icon: <ServiceOutlined />,
        onClick: () => handleMyServices()
      },
      {
        label: '消息中心',
        onClick: () => handleMessageCenter()
      }
    ],
    filterConfig: [
      {
        key: 'category',
        label: '服务类型',
        options: ['全部', '技术服务', '法律服务', '财税服务', '人力资源']
      },
      {
        key: 'region',
        label: '服务地区',
        options: ['全部', '北京市', '上海市', '广东省', '江苏省']
      },
      {
        key: 'price',
        label: '价格范围',
        options: ['全部', '免费', '1万以下', '1-5万', '5-10万', '10万以上']
      },
      {
        key: 'rating',
        label: '服务评分',
        options: ['全部', '5分', '4分以上', '3分以上']
      }
    ]
  };

  // 事件处理函数
  const handlePublishRequirement = () => {
    console.log('发布需求');
  };

  const handleMyServices = () => {
    console.log('我的服务');
  };

  const handleMessageCenter = () => {
    console.log('消息中心');
  };

  const handleCategoryClick = (category: any) => {
    console.log('点击分类:', category);
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log('筛选变化:', key, value);
  };

  const handleContactService = (service: any) => {
    console.log('联系服务商:', service);
  };

  const handleFavoriteService = (service: any) => {
    console.log('收藏服务:', service);
  };

  const handleShareService = (service: any) => {
    console.log('分享服务:', service);
  };

  const handleViewServiceDetails = (service: any) => {
    console.log('查看服务详情:', service);
  };

  return (
    <PermissionProvider userRole={userRole}>
      <div className="business-hall">
        <HallPageTemplate
          {...pageConfig}
          onCategoryClick={handleCategoryClick}
          onFilterChange={handleFilterChange}
        >
          {/* 服务列表 */}
          <div className="services-list">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : services.length > 0 ? (
              <List
                dataSource={services}
                renderItem={(service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    userRole={userRole}
                    onContact={handleContactService}
                    onFavorite={handleFavoriteService}
                    onShare={handleShareService}
                    onViewDetails={handleViewServiceDetails}
                  />
                )}
              />
            ) : (
              <Empty
                description="暂无服务信息"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={handlePublishRequirement}>
                  发布服务需求
                </Button>
              </Empty>
            )}
          </div>
        </HallPageTemplate>
      </div>
    </PermissionProvider>
  );
};

export default BusinessHall;
