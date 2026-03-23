/**
 * 申报状态徽章组件
 * 创建时间: 2026-03-23
 */

import React from 'react';
import { Tag, Badge } from 'antd';
import type { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  showDot?: boolean;
  size?: 'small' | 'default' | 'large';
}

const statusConfig: Record<ApplicationStatus, { color: string; text: string; dotColor?: string }> = {
  draft: { color: 'default', text: '草稿' },
  filling: { color: 'processing', text: '填写中' },
  pending: { color: 'warning', text: '待提交' },
  reviewing: { color: 'processing', text: '审核中', dotColor: '#1890ff' },
  needs_revision: { color: 'warning', text: '需补充', dotColor: '#faad14' },
  approved: { color: 'success', text: '已通过', dotColor: '#52c41a' },
  rejected: { color: 'error', text: '已驳回', dotColor: '#ff4d4f' },
  withdrawn: { color: 'default', text: '已撤回' },
  archived: { color: 'default', text: '已归档' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showDot = false,
  size = 'default' 
}) => {
  const config = statusConfig[status];
  
  if (showDot && config.dotColor) {
    return (
      <span>
        <Badge 
          status={
            status === 'approved' ? 'success' : 
            status === 'rejected' ? 'error' : 
            status === 'needs_revision' ? 'warning' : 'processing'
          } 
        />
        <span style={{ marginLeft: 8 }}>{config.text}</span>
      </span>
    );
  }
  
  return (
    <Tag 
      color={config.color}
      style={{ 
        fontSize: size === 'small' ? 12 : size === 'large' ? 14 : 13,
        padding: size === 'small' ? '0 6px' : size === 'large' ? '2px 10px' : '1px 8px',
      }}
    >
      {config.text}
    </Tag>
  );
};

export default StatusBadge;
