import React from 'react';
import { Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  color = 'blue'
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    const isPositive = trend.startsWith('+');
    return isPositive ? (
      <ArrowUpOutlined className="trend-icon trend-up" />
    ) : (
      <ArrowDownOutlined className="trend-icon trend-down" />
    );
  };

  const getTrendClass = () => {
    if (!trend) return '';
    return trend.startsWith('+') ? 'trend-positive' : 'trend-negative';
  };

  return (
    <Card className={`stat-card stat-card--${color}`} bordered={false}>
      <div className="stat-content">
        <div className="stat-icon">
          <span className="icon-emoji">{icon}</span>
        </div>
        <div className="stat-info">
          <div className="stat-value">{value}</div>
          <div className="stat-title">{title}</div>
          {trend && (
            <div className={`stat-trend ${getTrendClass()}`}>
              {getTrendIcon()}
              <span className="trend-text">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
