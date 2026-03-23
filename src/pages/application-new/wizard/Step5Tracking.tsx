/**
 * 申报向导 - 步骤5：审核跟踪
 * 创建时间: 2026-03-23
 */

import React from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Timeline,
  Row,
  Col,
  Descriptions,
  Alert,
  List,
  Badge,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DownloadOutlined,
  RollbackOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { Application, AuditLog } from '../types';

const { Title, Text } = Typography;

interface Step5TrackingProps {
  formData: any;
  onChange: (data: any) => void;
  application: Application | null;
}

const Step5Tracking: React.FC<Step5TrackingProps> = ({ formData, onChange, application }) => {
  // 模拟审核记录
  const auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      stage: 'submitted',
      action: '提交申报',
      operator: 'system',
      operatorName: '系统',
      operateTime: application?.submitTime || new Date().toISOString(),
    },
    {
      id: 'log-2',
      stage: 'submitted',
      action: '自动受理',
      operator: 'system',
      operatorName: '系统',
      operateTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'log-3',
      stage: 'formal_review',
      action: '分配审核员',
      operator: 'admin',
      operatorName: '审核管理员',
      operateTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ];

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'needs_revision':
        return 'warning';
      default:
        return 'processing';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'filling':
        return '填写中';
      case 'pending':
        return '待提交';
      case 'reviewing':
        return '审核中';
      case 'needs_revision':
        return '需补充';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已驳回';
      default:
        return status;
    }
  };

  return (
    <div>
      <Title level={4}>审核跟踪</Title>
      <Text type="secondary">实时查看申报审核进度</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 左侧跟踪区 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* 申报状态概览 */}
            <Card size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text type="secondary">申报状态</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={getStatusColor(application?.status || 'reviewing')} style={{ fontSize: 16, padding: '4px 12px' }}>
                      {getStatusText(application?.status || 'reviewing')}
                    </Tag>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text type="secondary">申报编号</Text>
                  <div style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold' }}>
                    {application?.projectNo || '--'}
                  </div>
                </div>
              </div>
            </Card>

            {/* 审核进度 */}
            <Card title="审核进度" size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                {['提交', '形式审查', '实质审核', '结果公示'].map((step, index) => {
                  const currentStage = application?.auditStage || 'submitted';
                  const stageMap: Record<string, number> = {
                    submitted: 0,
                    formal_review: 1,
                    substantive_review: 2,
                    result_publicity: 3,
                  };
                  const currentIndex = stageMap[currentStage] || 0;
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? '#52c41a' : '#f0f0f0',
                          color: isCompleted ? '#fff' : '#999',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          border: isCurrent ? '3px solid #1890ff' : undefined,
                        }}
                      >
                        {isCompleted ? <CheckCircleOutlined /> : index + 1}
                      </div>
                      <Text style={{ fontSize: 12, color: isCurrent ? '#1890ff' : undefined }}>
                        {step}
                      </Text>
                      {isCurrent && (
                        <div style={{ marginTop: 4 }}>
                          <Badge status="processing" text="进行中" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 进度连接线 */}
              <div style={{ display: 'flex', marginTop: -60, marginBottom: 40, padding: '0 40px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor: i < ((application?.currentStep || 1) - 1) ? '#52c41a' : '#f0f0f0',
                      margin: '0 20px',
                    }}
                  />
                ))}
              </div>

              {/* 当前阶段信息 */}
              <Alert
                message="当前阶段：形式审查中"
                description="审核员正在对申报材料进行形式审查，预计3-5个工作日完成"
                type="info"
                showIcon
              />
            </Card>

            {/* 审核记录 */}
            <Card title="审核记录" size="small">
              <Timeline mode="left">
                {auditLogs.map((log) => (
                  <Timeline.Item
                    key={log.id}
                    label={new Date(log.operateTime).toLocaleString('zh-CN')}
                    dot={log.operator === 'system' ? <SyncOutlined spin /> : <ClockCircleOutlined />}
                  >
                    <Text strong>{log.action}</Text>
                    <div>
                      <Text type="secondary">操作人：{log.operatorName}</Text>
                    </div>
                    {log.opinion && (
                      <div style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                        <Text>{log.opinion}</Text>
                      </div>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* 审核意见 */}
            {application?.auditOpinion && (
              <Card title="审核意见" size="small">
                <Alert
                  message="需补充材料"
                  description={application.auditOpinion}
                  type="warning"
                  showIcon
                  action={<Button size="small">立即补充</Button>}
                />
              </Card>
            )}
          </Space>
        </Col>

        {/* 右侧操作区 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="快捷操作" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button icon={<FileTextOutlined />} block>
                  查看申报详情
                </Button>
                <Button icon={<DownloadOutlined />} block>
                  下载申报材料
                </Button>
                {application?.status === 'reviewing' && (
                  <Button icon={<RollbackOutlined />} block danger>
                    撤回申报
                  </Button>
                )}
                {application?.status === 'needs_revision' && (
                  <Button type="primary" icon={<ExclamationCircleOutlined />} block>
                    补充材料
                  </Button>
                )}
              </Space>
            </Card>

            <Card title="申报信息" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="申报项目">
                  {application?.name}
                </Descriptions.Item>
                <Descriptions.Item label="申报企业">
                  {application?.enterpriseName}
                </Descriptions.Item>
                <Descriptions.Item label="提交时间">
                  {application?.submitTime ? new Date(application.submitTime).toLocaleString('zh-CN') : '--'}
                </Descriptions.Item>
                <Descriptions.Item label="截止日期">
                  {application?.deadline}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="需要帮助？" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" icon={<CustomerServiceOutlined />} block>
                  联系客服
                </Button>
                <Button block>查看常见问题</Button>
                <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                  客服电话：400-xxx-xxxx
                </Text>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Step5Tracking;
