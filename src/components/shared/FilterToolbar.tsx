import React, { useState } from 'react';
import { Select, Button, Space, Input } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import './FilterToolbar.scss';

const { Option } = Select;

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  value?: string;
}

interface FilterToolbarProps {
  filterConfig: FilterConfig[];
  onFilterChange?: (key: string, value: string) => void;
  onSearch?: (keyword: string) => void;
  onReset?: () => void;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filterConfig,
  onFilterChange,
  onSearch,
  onReset
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onFilterChange?.(key, value);
  };

  const handleSearch = () => {
    onSearch?.(searchKeyword);
  };

  const handleReset = () => {
    setFilters({});
    setSearchKeyword('');
    onReset?.();
  };

  return (
    <div className="filter-toolbar">
      <div className="filter-section">
        {/* 搜索框 */}
        <div className="search-box">
          <Input.Search
            placeholder="搜索服务、需求、企业..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            size="large"
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>

        {/* 筛选条件 */}
        <div className="filter-groups">
          {filterConfig.map((config) => (
            <div key={config.key} className="filter-group">
              <span className="filter-label">{config.label}：</span>
              <Select
                placeholder={`选择${config.label}`}
                value={filters[config.key]}
                onChange={(value) => handleFilterChange(config.key, value)}
                style={{ width: 150 }}
                allowClear
              >
                {config.options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="filter-actions">
          <Space>
            <Button 
              icon={<FilterOutlined />}
              onClick={() => {/* 展开高级筛选 */}}
            >
              高级筛选
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </div>
      </div>

      {/* 排序选项 */}
      <div className="sort-section">
        <span className="sort-label">排序：</span>
        <Select defaultValue="latest" style={{ width: 120 }}>
          <Option value="latest">最新发布</Option>
          <Option value="popular">最受欢迎</Option>
          <Option value="rating">评分最高</Option>
          <Option value="price">价格排序</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterToolbar;
