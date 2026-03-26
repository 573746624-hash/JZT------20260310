/**
 * 申报进度条组件
 * 创建时间: 2026-03-23
 */

import React from 'react';
import { Progress, Steps, Tooltip } from 'antd';
import type { ApplicationStatus } from '../types';

const { Step } = Steps;

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  status: ApplicationStatus;
  showSteps?: boolean;
  size?: 'small' | 'default' | 'large';
}

const stepTitles = ['资质填写', '材料上传', '预览确认', '提交审核', '审核跟踪'];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  progress,
  status,
  showSteps = false,
  size = 'default',
}) => {
  const getProgressStatus = () => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'exception';
      case 'needs_revision':
        return 'active';
      default:
        return 'active';
    }
  };

  const getStrokeColor = () => {
    switch (status) {
      case 'approved':
        return '#52c41a';
      case 'rejected':
        return '#ff4d4f';
      case 'needs_revision':
        return '#faad14';
      default:
        return '#1890ff';
    }
  };

  if (showSteps) {
    return (
      <Steps
        current={currentStep}
        size={size === 'small' ? 'small' : size === 'large' ? 'default' : 'small'}
        status={status === 'rejected' ? 'error' : status === 'needs_revision' ? 'wait' : 'process'}
      >
        {stepTitles.map((title, index) => (
          <Step 
            key={index} 
            title={size !== 'small' ? title : undefined}
            description={size === 'large' ? `第${index + 1}步` : undefined}
          />
        ))}
      </Steps>
    );
  }

  return (
    <Tooltip title={`当前进度：第 ${currentStep}/${totalSteps} 步`}>
      <Progress
        percent={progress}
        status={getProgressStatus()}
        strokeColor={getStrokeColor()}
        size={size === 'small' ? { width: 120, height: 6 } : size === 'large' ? { width: 300, height: 10 } : undefined}
        format={(percent) => size !== 'small' ? `${percent}%` : undefined}
      />
    </Tooltip>
    );
  };

export default ProgressBar;
