/**
 * 审核记录与回溯页面
 * 创建时间: 2026-03-23
 * 功能: 展示所有内容的审核历史记录，支持筛选、查询和回溯
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Statistic,
  Timeline,
  Drawer,
  Descriptions,
  Badge,
  Typography,
  Tooltip,
  Empty,
  message,
} from 'antd';
import {
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  BankOutlined,
  SafetyOutlined,
  StarOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useEnterprisePortal } from '../../../context/EnterprisePortalContext';
import type { AuditRecord, AuditFilter, AuditLogQuery, AuditStatistics } from '../../../types/enterprise-portal';
import './styles.css';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

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
      style={{ fontSize: 13 }}
    >
      {getAuditStatusText(status as any)}
    </Tag>
  );
};

/**
 * 内容类型标签
 */
const ContentTypeTag: React.FC<{ type: string }> = ({ type }) => {
  const typeMap: Record<string, { text: string; icon: React.ReactNode; color: string }> = {
    enterprise_info: { text: '企业信息', icon: <FileTextOutlined />, color: 'blue' },
    business_data: { text: '经营数据', icon: <BankOutlined />, color: 'green' },
    credit_data: { text: '信用数据', icon: <SafetyOutlined />, color: 'purple' },
    recommendation: { text: '推荐内容', icon: <StarOutlined />, color: 'orange' },
    profile_data: { text: '画像数据', icon: <FileTextOutlined />, color: 'cyan' },
  };

  const config = typeMap[type] || { text: type, icon: <FileTextOutlined />, color: 'default' };

  return (
    <Tag icon={config.icon} color={config.color}>
      {config.text}
    </Tag>
  );
};

/**
 * 审核记录详情抽屉
 */
const AuditDetailDrawer: React.FC<{
  record: AuditRecord | null;
  visible: boolean;
  onClose: () => void;
}> = ({ record, visible, onClose }) => {
  const { getAuditHistory } = useEnterprisePortal();
  
  if (!record) return null;

  const history = getAuditHistory(record.contentId);

  return (
    <Drawer
      title="审核详情"
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
    >
      <Descriptions bordered column={1} labelStyle={{ width: 120 }}>
        <Descriptions.Item label="记录ID">{record.id}</Descriptions.Item>
        <Descriptions.Item label="内容ID">{record.contentId}</Descriptions.Item>
        <Descriptions.Item label="内容类型">
          <ContentTypeTag type={record.contentType} />
        </Descriptions.Item>
        <Descriptions.Item label="审核状态">
          <AuditStatusTag status={record.status} />
        </Descriptions.Item>
        <Descriptions.Item label="审核人">{record.auditor}</Descriptions.Item>
        <Descriptions.Item label="审核时间">
          {new Date(record.auditTime).toLocaleString('zh-CN')}
        </Descriptions.Item>
        <Descriptions.Item label="版本号">v{record.version}</Descriptions.Item>
        {record.reason && (
          <Descriptions.Item label="审核备注">
            <Text type="secondary">{record.reason}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider style={{ margin: '24px 0' }} />

      <Title level={5}>
        <HistoryOutlined style={{ marginRight: 8 }} />
        审核历史回溯
      </Title>
      
      <Timeline mode="left" style={{ marginTop: 16 }}>
        {history.map((item, index) => (
          <Timeline.Item
            key={item.id}
            color={item.status === 'approved' ? 'green' : item.status === 'rejected' ? 'red' : 'blue'}
            label={new Date(item.auditTime).toLocaleDateString('zh-CN')}
          >
            <Space direction="vertical" size={0}>
              <Text strong>
                {item.status === 'approved' ? '审核通过' : 
                 item.status === 'rejected' ? '审核驳回' : 
                 item.status === 'pending' ? '提交审核' : '状态变更'}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                审核人: {item.auditor} | 版本: v{item.version}
              </Text>
              {item.reason && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  备注: {item.reason}
                </Text>
              )}
            </Space>
          </Timeline.Item>
        ))}
      </Timeline>

      {history.length === 0 && (
        <Empty description="暂无历史记录" />
      )}
    </Drawer>
  );
};

/**
 * 审核记录主组件
 */
const AuditLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    queryAuditLogs, 
    auditStatistics,
    refreshAuditStatistics,
    loading,
  } = useEnterprisePortal();

  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filter, setFilter] = useState<AuditFilter>({});
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 加载数据
  const loadData = async (pageNum = 1, pageSize = 10) => {
    try {
      const query: AuditLogQuery = {
        ...filter,
        pageNum,
        pageSize,
      };
      const result = await queryAuditLogs(query);
      setRecords(result.list);
      setPagination({
        current: result.pageNum,
        pageSize: result.pageSize,
        total: result.total,
      });
    } catch (error) {
      message.error('加载审核记录失败');
    }
  };

  // 初始化加载
  useEffect(() => {
    loadData();
    refreshAuditStatistics();
  }, []);

  // 筛选条件变化时重新加载
  useEffect(() => {
    loadData(1);
  }, [filter]);

  // 表格列定义
  const columns = [
    {
      title: '记录ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      ellipsis: true,
    },
    {
      title: '内容类型',
      dataIndex: 'contentType',
      key: 'contentType',
      width: 140,
      render: (type: string) => <ContentTypeTag type={type} />,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => <AuditStatusTag status={status} />,
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
      key: 'auditor',
      width: 120,
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
      sorter: (a: AuditRecord, b: AuditRecord) => 
        new Date(a.auditTime).getTime() - new Date(b.auditTime).getTime(),
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      render: (version: number) => `v${version}`,
    },
    {
      title: '备注',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason: string) => reason || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: AuditRecord) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(record);
            setDrawerVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // 处理筛选
  const handleFilterChange = (key: keyof AuditFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  // 处理刷新
  const handleRefresh = async () => {
    message.loading('正在刷新数据...', 0);
    await Promise.all([
      loadData(pagination.current, pagination.pageSize),
      refreshAuditStatistics(),
    ]);
    message.destroy();
    message.success('数据已更新');
  };

  // 处理导出
  const handleExport = () => {
    message.success('审核记录导出成功');
  };

  return (
    <div className="audit-logs-container">
      {/* 页面头部 */}
      <div className="page-header">
        <Title level={4} style={{ margin: 0 }}>
          <HistoryOutlined style={{ marginRight: 8 }} />
          审核记录与回溯
        </Title>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出记录
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="总记录数"
              value={auditStatistics?.totalCount || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="已通过"
              value={auditStatistics?.approvedCount || 0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="待审核"
              value={auditStatistics?.pendingCount || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="已驳回"
              value={auditStatistics?.rejectedCount || 0}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card className="filter-card" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="内容类型"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('contentType', value)}
            >
              <Option value="enterprise_info">企业信息</Option>
              <Option value="business_data">经营数据</Option>
              <Option value="credit_data">信用数据</Option>
              <Option value="recommendation">推荐内容</Option>
              <Option value="profile_data">画像数据</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="审核状态"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="pending">待审核</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已驳回</Option>
              <Option value="expired">已过期</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
              onChange={(dates) => {
                if (dates) {
                  handleFilterChange('startTime', dates[0]?.toISOString());
                  handleFilterChange('endTime', dates[1]?.toISOString());
                } else {
                  handleFilterChange('startTime', undefined);
                  handleFilterChange('endTime', undefined);
                }
              }}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Input.Search
              placeholder="搜索关键词"
              allowClear
              onSearch={(value) => handleFilterChange('keyword', value)}
            />
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => loadData(page, pageSize),
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 详情抽屉 */}
      <AuditDetailDrawer
        record={selectedRecord}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};

export default AuditLogsPage;
