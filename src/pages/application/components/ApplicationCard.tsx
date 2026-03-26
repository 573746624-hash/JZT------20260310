/**
 * 申报卡片组件
 * 创建时间: 2026-03-23
 */

import React from 'react';
import { Card, Tag, Typography, Space, Button, Divider, Tooltip, Checkbox } from 'antd';
import { 
  ClockCircleOutlined, 
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import type { Application, ApplicationStatus } from '../types';

const { Title, Text } = Typography;

interface ApplicationCardProps {
  application: Application;
  onContinue?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onContact?: (id: string) => void;
  showCheckbox?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onContinue,
  onView,
  onDelete,
  onContact,
  showCheckbox = false,
  selected = false,
  onSelect,
}) => {
  const getDeadlineTag = () => {
    const deadline = new Date(application.deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Tag color="error">已截止</Tag>;
    } else if (diffDays <= 3) {
      return <Tag color="warning" icon={<ExclamationCircleOutlined />}>剩 {diffDays} 天</Tag>;
    } else if (diffDays <= 7) {
      return <Tag color="processing">剩 {diffDays} 天</Tag>;
    }
    return null;
  };

  const getActionButtons = () => {
    const buttons = [];
    
    if (['draft', 'filling', 'pending', 'needs_revision'].includes(application.status)) {
      buttons.push(
        <Button 
          key="continue" 
          type="primary" 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => onContinue?.(application.id)}
        >
          {application.status === 'needs_revision' ? '补充材料' : '继续填写'}
        </Button>
      );
    }
    
    buttons.push(
      <Button 
        key="view" 
        size="small" 
        icon={<EyeOutlined />}
        onClick={() => onView?.(application.id)}
      >
        查看详情
      </Button>
    );
    
    if (application.status === 'draft') {
      buttons.push(
        <Button 
          key="delete" 
          danger 
          size="small" 
          icon={<DeleteOutlined />}
          onClick={() => onDelete?.(application.id)}
        >
          删除
        </Button>
      );
    }
    
    buttons.push(
      <Button 
        key="contact" 
        size="small" 
        icon={<CustomerServiceOutlined />}
        onClick={() => onContact?.(application.id)}
      >
        联系客服
      </Button>
    );
    
    return buttons;
  };

  return (
    <Card
      className="application-card"
      style={{
        borderRadius: 8,
        borderLeft: application.status === 'needs_revision' ? '4px solid #faad14' : undefined,
        boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06)',
      }}
      bodyStyle={{ padding: '16px 24px' }}
      hoverable
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {/* 头部：项目名称和状态 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Space size={12}>
            {showCheckbox && (
              <Checkbox 
                checked={selected}
                onChange={(e) => onSelect?.(application.id, e.target.checked)}
              />
            )}
            <Title level={5} style={{ margin: 0 }}>{application.name}</Title>
            <StatusBadge status={application.status} />
            {getDeadlineTag()}
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            编号: {application.projectNo}
          </Text>
        </div>

        {/* 信息行 */}
        <Text type="secondary" style={{ fontSize: 13 }}>
          {application.policyName} | 负责人: {application.applicantName} | 
          最后更新: {application.updateTime}
        </Text>

        {/* 进度区 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
            当前步骤：第 {application.currentStep}/{application.totalSteps} 步
          </Text>
          <div style={{ flex: 1, maxWidth: 200 }}>
            <ProgressBar 
              currentStep={application.currentStep}
              totalSteps={application.totalSteps}
              progress={application.progress}
              status={application.status}
              size="small"
            />
          </div>
          <Text style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
            {application.progress}%
          </Text>
        </div>

        {/* 操作按钮 */}
        <Space size={8}>
          {getActionButtons()}
        </Space>
      </Space>
    </Card>
  );
};

export default ApplicationCard;
