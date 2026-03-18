import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StatCard from './StatCard';
import CategoryGrid from './CategoryGrid';
import FilterToolbar from './FilterToolbar';
import './HallPageTemplate.scss';

interface HallPageTemplateProps {
  title: string;
  description: string;
  stats: Array<{
    title: string;
    value: string;
    trend?: string;
    icon: string;
    color?: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count?: number;
    description?: string;
  }>;
  quickActions: Array<{
    label: string;
    type?: 'primary' | 'default';
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
  filterConfig: Array<{
    key: string;
    label: string;
    options: string[];
    value?: string;
  }>;
  children: React.ReactNode;
  onCategoryClick?: (category: any) => void;
  onFilterChange?: (key: string, value: string) => void;
}

const HallPageTemplate: React.FC<HallPageTemplateProps> = ({
  title,
  description,
  stats,
  categories,
  quickActions,
  filterConfig,
  children,
  onCategoryClick,
  onFilterChange,
}) => {
  return (
    <div className="hall-page">
      {/* 头部Banner区域 */}
      <div className="hall-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="hall-title">{title}</h1>
            <p className="hall-description">{description}</p>
          </div>
          
          <div className="quick-actions">
            <Space size="middle">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  type={action.type || 'default'}
                  size="large"
                  icon={action.icon}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </div>
        </div>
        
        {/* 统计数据 */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      {/* 服务/需求分类 */}
      <div className="category-section">
        <h2 className="section-title">服务分类</h2>
        <CategoryGrid 
          categories={categories} 
          onCategoryClick={onCategoryClick}
        />
      </div>

      {/* 筛选工具栏 */}
      <FilterToolbar 
        filterConfig={filterConfig}
        onFilterChange={onFilterChange}
      />

      {/* 主要内容区域 */}
      <div className="content-section">
        {children}
      </div>
    </div>
  );
};

export default HallPageTemplate;
