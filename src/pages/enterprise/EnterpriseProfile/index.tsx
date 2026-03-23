/**
 * 企业画像展示页面
 * 创建时间: 2026-03-23
 * 功能: 展示完整的企业画像信息，包括基本信息、经营状况、信用评级等
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Tabs,
  Progress,
  Row,
  Col,
  Statistic,
  Timeline,
  Button,
  Badge,
  Space,
  Typography,
  Divider,
  Alert,
  Table,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  HistoryOutlined,
  SafetyOutlined,
  BankOutlined,
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useEnterprisePortal } from '../../../context/EnterprisePortalContext';
import type { CreditDimension, AuditRecord } from '../../../types/enterprise-portal';
import './styles.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

/**
 * 审核状态标签组件
 */
const AuditStatusTag: React.FC<{ status: string }> = ({ status }) => {
  const { getAuditStatusText, getAuditStatusColor } = useEnterprisePortal();
  
  const iconMap: Record<string, React.ReactNode> = {
    pending: <ClockCircleOutlined />,
    approved: <CheckCircleOutlined />,
    rejected: <CloseCircleOutlined />,
    expired: <ExclamationCircleOutlined />,
  };

  return (
    <Tag 
      icon={iconMap[status]} 
      color={getAuditStatusColor(status as any)}
      style={{ fontSize: 14, padding: '4px 12px' }}
    >
      {getAuditStatusText(status as any)}
    </Tag>
  );
};

/**
 * 信用评级展示组件
 */
const CreditRatingDisplay: React.FC<{ 
  rating: string; 
  score: number;
  dimensions: CreditDimension[];
}> = ({ rating, score, dimensions }) => {
  const getRatingColor = (r: string) => {
    const colors: Record<string, string> = {
      AAA: '#52c41a',
      AA: '#73d13d',
      A: '#95de64',
      BBB: '#d9f7be',
      BB: '#ffa940',
      B: '#ff7a45',
      CCC: '#ff4d4f',
      CC: '#cf1322',
      C: '#820014',
    };
    return colors[r] || '#999';
  };

  return (
    <div className="credit-rating-display">
      <div className="rating-header">
        <div 
          className="rating-badge"
          style={{ backgroundColor: getRatingColor(rating) }}
        >
          <TrophyOutlined style={{ fontSize: 32, marginBottom: 8 }} />
          <div className="rating-level">{rating}</div>
          <div className="rating-label">信用评级</div>
        </div>
        <div className="rating-score">
          <div className="score-value">{score}</div>
          <div className="score-label">综合评分</div>
          <Progress 
            percent={score} 
            strokeColor={getRatingColor(rating)}
            showInfo={false}
            style={{ width: 200, marginTop: 8 }}
          />
        </div>
      </div>
      
      <Divider />
      
      <div className="rating-dimensions">
        <Title level={5}>信用维度分析</Title>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {dimensions.map((dim, index) => (
            <Col xs={24} sm={12} key={index}>
              <Card size="small" className="dimension-card">
                <div className="dimension-header">
                  <Text strong>{dim.name}</Text>
                  <Tag color={dim.score >= 80 ? 'success' : dim.score >= 60 ? 'warning' : 'error'}>
                    {dim.score}分
                  </Tag>
                </div>
                <Progress 
                  percent={dim.score} 
                  size="small"
                  strokeColor={dim.score >= 80 ? '#52c41a' : dim.score >= 60 ? '#faad14' : '#ff4d4f'}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  权重: {(dim.weight * 100).toFixed(0)}% | {dim.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

/**
 * 审核历史表格
 */
const AuditHistoryTable: React.FC<{ records: AuditRecord[] }> = ({ records }) => {
  const { getAuditStatusText, getAuditStatusColor } = useEnterprisePortal();

  const columns = [
    {
      title: '内容类型',
      dataIndex: 'contentType',
      key: 'contentType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          enterprise_info: '企业信息',
          business_data: '经营数据',
          credit_data: '信用数据',
          recommendation: '推荐内容',
          profile_data: '画像数据',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getAuditStatusColor(status as any)}>
          {getAuditStatusText(status as any)}
        </Tag>
      ),
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
      key: 'auditor',
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: number) => `v${version}`,
    },
    {
      title: '备注',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => reason || '-',
    },
  ];

  return (
    <Table
      dataSource={records}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      size="small"
    />
  );
};

/**
 * 企业画像主组件
 */
const EnterpriseProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    enterpriseProfile, 
    certificationStatus,
    auditLogs,
    loading,
    getAuditHistory,
  } = useEnterprisePortal();

  const [activeTab, setActiveTab] = useState('basic');

  if (loading || !enterpriseProfile) {
    return (
      <div className="enterprise-profile-container">
        <Card loading style={{ minHeight: 600 }} />
      </div>
    );
  }

  const { basicInfo, businessStatus, creditRating } = enterpriseProfile;
  const contentAuditHistory = getAuditHistory(basicInfo.id);

  return (
    <div className="enterprise-profile-container">
      {/* 页面头部 */}
      <div className="profile-header">
        <div className="header-main">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {basicInfo.name}
            </Title>
            <Space style={{ marginTop: 8 }}>
              <Text type="secondary">统一社会信用代码: {basicInfo.unifiedCode}</Text>
              <Divider type="vertical" />
              <AuditStatusTag status={basicInfo.auditStatus} />
            </Space>
          </div>
          <Space>
            <Button 
              icon={<HistoryOutlined />}
              onClick={() => navigate('/enterprise/audit-logs')}
            >
              审核记录
            </Button>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => navigate('/enterprise/profile/edit')}
            >
              编辑信息
            </Button>
          </Space>
        </div>
      </div>

      {/* 信息概览卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="信息完整度"
              value={enterpriseProfile.completeness}
              suffix="%"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={enterpriseProfile.completeness} 
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="信用评级"
              value={creditRating.creditLevel}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              评分: {creditRating.overallScore}分
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="员工人数"
              value={businessStatus.employeeCount}
              suffix="人"
              prefix={<TeamOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              社保缴纳: {businessStatus.socialSecurityCount}人
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="年营业额"
              value={(businessStatus.annualRevenue / 10000).toFixed(0)}
              suffix="万元"
              prefix={<BankOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              纳税信用等级: {businessStatus.taxCreditLevel}级
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 详细信息标签页 */}
      <Card className="profile-tabs-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          {/* 基本信息 */}
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                基本信息
                <Badge 
                  status={basicInfo.auditStatus === 'approved' ? 'success' : 'processing'}
                  style={{ marginLeft: 4 }}
                />
              </span>
            } 
            key="basic"
          >
            <Descriptions 
              bordered 
              column={{ xs: 1, sm: 2, lg: 3 }}
              labelStyle={{ backgroundColor: '#fafafa', fontWeight: 500 }}
            >
              <Descriptions.Item label="企业名称" span={2}>
                {basicInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label="统一社会信用代码">
                {basicInfo.unifiedCode}
              </Descriptions.Item>
              <Descriptions.Item label="法定代表人">
                {basicInfo.legalPerson}
              </Descriptions.Item>
              <Descriptions.Item label="注册资本">
                {basicInfo.registeredCapital}
              </Descriptions.Item>
              <Descriptions.Item label="成立日期">
                {basicInfo.establishDate}
              </Descriptions.Item>
              <Descriptions.Item label="所属行业" span={2}>
                {basicInfo.industry}
              </Descriptions.Item>
              <Descriptions.Item label="企业规模">
                {basicInfo.scale === 'micro' ? '微型企业' :
                 basicInfo.scale === 'small' ? '小型企业' :
                 basicInfo.scale === 'medium' ? '中型企业' : '大型企业'}
              </Descriptions.Item>
              <Descriptions.Item label="企业地址" span={3}>
                {basicInfo.address}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {basicInfo.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="电子邮箱" span={2}>
                {basicInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="官方网站">
                {basicInfo.website || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="经营范围" span={3}>
                {basicInfo.businessScope}
              </Descriptions.Item>
            </Descriptions>

            <Alert
              message="审核信息"
              description={
                <Space direction="vertical">
                  <Text>审核状态: <AuditStatusTag status={basicInfo.auditStatus} /></Text>
                  <Text>审核时间: {new Date(basicInfo.auditTime || '').toLocaleString('zh-CN')}</Text>
                  <Text>审核人: {basicInfo.auditor}</Text>
                  <Text>版本号: v{basicInfo.version}</Text>
                </Space>
              }
              type="info"
              style={{ marginTop: 16 }}
              showIcon
            />
          </TabPane>

          {/* 经营状况 */}
          <TabPane 
            tab={
              <span>
                <BankOutlined />
                经营状况
                <Badge 
                  status={businessStatus.auditStatus === 'approved' ? 'success' : 'processing'}
                  style={{ marginLeft: 4 }}
                />
              </span>
            } 
            key="business"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="经营数据" size="small">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="年营业额">
                      ¥{businessStatus.annualRevenue.toLocaleString('zh-CN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="员工总数">
                      {businessStatus.employeeCount}人
                    </Descriptions.Item>
                    <Descriptions.Item label="社保缴纳人数">
                      {businessStatus.socialSecurityCount}人
                    </Descriptions.Item>
                    <Descriptions.Item label="纳税信用等级">
                      <Tag color={businessStatus.taxCreditLevel === 'A' ? 'success' : 'default'}>
                        {businessStatus.taxCreditLevel}级
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="知识产权数量">
                      {businessStatus.intellectualPropertyCount}项
                    </Descriptions.Item>
                    <Descriptions.Item label="项目经验数量">
                      {businessStatus.projectExperienceCount}个
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="数据更新时间" size="small">
                  <Timeline>
                    <Timeline.Item color="green">
                      <Text strong>最新更新</Text>
                      <div>{new Date(businessStatus.lastUpdated).toLocaleString('zh-CN')}</div>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <Text strong>审核通过</Text>
                      <div>{new Date(businessStatus.auditTime || '').toLocaleString('zh-CN')}</div>
                    </Timeline.Item>
                    <Timeline.Item color="gray">
                      <Text strong>数据录入</Text>
                      <div>{new Date(businessStatus.lastUpdated).toLocaleDateString('zh-CN')}</div>
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </Col>
            </Row>

            <Alert
              message="审核信息"
              description={
                <Space direction="vertical">
                  <Text>审核状态: <AuditStatusTag status={businessStatus.auditStatus} /></Text>
                  <Text>审核时间: {new Date(businessStatus.auditTime || '').toLocaleString('zh-CN')}</Text>
                  <Text>审核人: {businessStatus.auditor}</Text>
                  <Text>版本号: v{businessStatus.version}</Text>
                </Space>
              }
              type="info"
              style={{ marginTop: 16 }}
              showIcon
            />
          </TabPane>

          {/* 信用评级 */}
          <TabPane 
            tab={
              <span>
                <SafetyOutlined />
                信用评级
                <Badge 
                  status={creditRating.auditStatus === 'approved' ? 'success' : 'processing'}
                  style={{ marginLeft: 4 }}
                />
              </span>
            } 
            key="credit"
          >
            <CreditRatingDisplay
              rating={creditRating.creditLevel}
              score={creditRating.overallScore}
              dimensions={creditRating.dimensions}
            />

            <Alert
              message="评级信息"
              description={
                <Space direction="vertical">
                  <Text>评估日期: {creditRating.evaluationDate}</Text>
                  <Text>有效期至: {creditRating.validUntil}</Text>
                  <Text>审核状态: <AuditStatusTag status={creditRating.auditStatus} /></Text>
                  <Text>审核时间: {new Date(creditRating.auditTime || '').toLocaleString('zh-CN')}</Text>
                  <Text>审核机构: {creditRating.auditor}</Text>
                </Space>
              }
              type="info"
              style={{ marginTop: 16 }}
              showIcon
            />
          </TabPane>

          {/* 审核历史 */}
          <TabPane 
            tab={
              <span>
                <HistoryOutlined />
                审核历史
                <Badge 
                  count={contentAuditHistory.length}
                  style={{ marginLeft: 4, backgroundColor: '#1890ff' }}
                />
              </span>
            } 
            key="history"
          >
            <Alert
              message="审核记录说明"
              description="以下展示了该企业所有内容的审核历史记录，包括企业信息、经营数据、信用评级等的审核状态变更。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <AuditHistoryTable records={auditLogs} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default EnterpriseProfilePage;
