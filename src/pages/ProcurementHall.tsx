import React, { useState, useEffect } from 'react';
import { Button, List, Empty, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PermissionProvider } from '../components/shared/PermissionProvider';
import HallPageTemplate from '../components/shared/HallPageTemplate';
import RequirementCard from '../components/procurement/RequirementCard';
import { UserRole } from '../utils/permissions';
import './ProcurementHall.css';

// 模拟数据
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
    status: 'active' as const,
    viewCount: 156,
    responseCount: 8,
    tags: ['数控机床', '五轴联动', '航空制造'],
    urgent: true
  },
  {
    id: '2',
    title: '智慧园区综合管理平台解决方案',
    description: '需要建设智慧园区综合管理平台，包括安防监控、能耗管理、设备运维、访客管理等功能模块。要求支持移动端应用，具备数据分析和报表功能。',
    category: '服务采购',
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
    status: 'active' as const,
    viewCount: 89,
    responseCount: 12,
    tags: ['智慧园区', '管理平台', '物联网']
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
    status: 'active' as const,
    viewCount: 234,
    responseCount: 15,
    tags: ['锂电池', '隔膜', '生产线设备']
  }
];

const ProcurementHall: React.FC = () => {
  const [requirements, setRequirements] = useState(mockRequirements);
  const [loading, setLoading] = useState(false);
  const [userRole] = useState<UserRole>('supplier');

  // 页面配置
  const pageConfig = {
    title: '采购大厅',
    description: '企业采购需求发布与撮合平台',
    stats: [
      {
        title: '活跃需求',
        value: '1,280+',
        trend: '+12%',
        icon: '📋',
        color: 'blue'
      },
      {
        title: '注册供应商',
        value: '8,960+',
        trend: '+8%',
        icon: '🏭',
        color: 'green'
      },
      {
        title: '成功撮合',
        value: '3,420+',
        trend: '+15%',
        icon: '🤝',
        color: 'orange'
      },
      {
        title: '交易金额',
        value: '¥2.8亿+',
        trend: '+25%',
        icon: '💰',
        color: 'purple'
      }
    ],
    categories: [
      {
        id: 'equipment',
        name: '设备采购',
        icon: '🔧',
        count: 456,
        description: '生产设备、检测设备、办公设备'
      },
      {
        id: 'service',
        name: '服务采购',
        icon: '🛠️',
        count: 234,
        description: '技术服务、咨询服务、维护服务'
      },
      {
        id: 'material',
        name: '物资采购',
        icon: '📦',
        count: 345,
        description: '原材料、零部件、办公用品'
      },
      {
        id: 'technology',
        name: '技术采购',
        icon: '💡',
        count: 123,
        description: '专利技术、软件系统、解决方案'
      },
      {
        id: 'construction',
        name: '工程采购',
        icon: '🏗️',
        count: 89,
        description: '建筑工程、装修工程、基础设施'
      },
      {
        id: 'logistics',
        name: '物流采购',
        icon: '🚚',
        count: 167,
        description: '运输服务、仓储服务、配送服务'
      },
      {
        id: 'finance',
        name: '金融采购',
        icon: '💳',
        count: 78,
        description: '融资服务、保险服务、财务服务'
      },
      {
        id: 'other',
        name: '其他采购',
        icon: '📋',
        count: 234,
        description: '其他类型的采购需求'
      }
    ],
    quickActions: [
      {
        label: '发布采购需求',
        type: 'primary' as const,
        icon: <PlusOutlined />,
        onClick: () => handlePublishRequirement()
      },
      {
        label: '我的采购',
        onClick: () => handleMyProcurement()
      },
      {
        label: '消息中心',
        onClick: () => handleMessageCenter()
      }
    ],
    filterConfig: [
      {
        key: 'category',
        label: '采购类型',
        options: ['全部', '设备采购', '服务采购', '物资采购', '技术采购']
      },
      {
        key: 'region',
        label: '采购地区',
        options: ['全部', '北京市', '上海市', '广东省', '江苏省']
      },
      {
        key: 'budget',
        label: '预算范围',
        options: ['全部', '10万以下', '10-50万', '50-100万', '100万以上']
      },
      {
        key: 'status',
        label: '需求状态',
        options: ['全部', '招募中', '即将截止', '已截止']
      }
    ]
  };

  // 事件处理函数
  const handlePublishRequirement = () => {
    console.log('发布采购需求');
  };

  const handleMyProcurement = () => {
    console.log('我的采购');
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

  const handleEditRequirement = (requirement: any) => {
    console.log('编辑需求:', requirement);
  };

  const handleDeleteRequirement = (requirement: any) => {
    console.log('删除需求:', requirement);
  };

  const handleContactRequirement = (requirement: any) => {
    console.log('联系需求方:', requirement);
  };

  const handleFavoriteRequirement = (requirement: any) => {
    console.log('收藏需求:', requirement);
  };

  const handleApproveRequirement = (requirement: any) => {
    console.log('审核需求:', requirement);
  };

  return (
    <PermissionProvider userRole={userRole}>
      <div className="procurement-hall">
        <HallPageTemplate
          {...pageConfig}
          onCategoryClick={handleCategoryClick}
          onFilterChange={handleFilterChange}
        >
          {/* 需求列表 */}
          <div className="requirements-list">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : requirements.length > 0 ? (
              <List
                dataSource={requirements}
                renderItem={(requirement) => (
                  <RequirementCard
                    key={requirement.id}
                    requirement={requirement}
                    userRole={userRole}
                    onEdit={handleEditRequirement}
                    onDelete={handleDeleteRequirement}
                    onContact={handleContactRequirement}
                    onFavorite={handleFavoriteRequirement}
                    onApprove={handleApproveRequirement}
                  />
                )}
              />
            ) : (
              <Empty
                description="暂无采购需求"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={handlePublishRequirement}>
                  发布第一个采购需求
                </Button>
              </Empty>
            )}
          </div>
        </HallPageTemplate>
      </div>
    </PermissionProvider>
  );
};

export default ProcurementHall;
