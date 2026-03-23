/**
 * 申报列表页（管理视图）
 * 创建时间: 2026-03-23
 * 功能: 企业全部申报项目的集中管理
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Input,
  Select,
  DatePicker,
  Tag,
  Tooltip,
  Popconfirm,
  Checkbox,
  Row,
  Col,
  Empty,
  Spin,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  BellOutlined,
  FolderOpenOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UserSwitchOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useApplications } from '../hooks/useApplications';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import ApplicationCard from '../components/ApplicationCard';
import type { Application, ApplicationStatus, ApplicationFilter } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ListView: React.FC = () => {
  const navigate = useNavigate();
  const {
    applications,
    loading,
    pagination,
    setPagination,
    fetchApplications,
    deleteApplication,
  } = useApplications();

  const [filter, setFilter] = useState<ApplicationFilter>({});
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // 加载数据
  const loadData = useCallback(async () => {
    const data = await fetchApplications(filter);
    setFilteredApps(data);
    setPagination(prev => ({ ...prev, total: data.length }));
  }, [filter, fetchApplications, setPagination]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 状态选项
  const statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'draft', label: '草稿' },
    { value: 'filling', label: '填写中' },
    { value: 'pending', label: '待提交' },
    { value: 'reviewing', label: '审核中' },
    { value: 'needs_revision', label: '需补充' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已驳回' },
    { value: 'withdrawn', label: '已撤回' },
    { value: 'archived', label: '已归档' },
  ];

  // 政策类型选项
  const policyTypeOptions = [
    { value: 'high_tech', label: '高新技术企业认定' },
    { value: 'specialized', label: '专精特新中小企业' },
    { value: 'tech_sme', label: '科技型中小企业' },
    { value: 'rd_expense', label: '研发费用加计扣除' },
    { value: 'innovation', label: '创新创业支持' },
  ];

  // 表格列定义
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string, record: Application) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.projectNo}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: '政策类型',
      dataIndex: 'policyName',
      key: 'policyName',
      width: 180,
    },
    {
      title: '当前步骤',
      dataIndex: 'currentStep',
      key: 'currentStep',
      width: 120,
      render: (step: number, record: Application) => (
        <Text>第 {step}/{record.totalSteps} 步</Text>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number, record: Application) => (
        <ProgressBar
          currentStep={record.currentStep}
          totalSteps={record.totalSteps}
          progress={progress}
          status={record.status}
          size="small"
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ApplicationStatus) => <StatusBadge status={status} />,
    },
    {
      title: '负责人',
      dataIndex: 'applicantName',
      key: 'applicantName',
      width: 100,
    },
    {
      title: '截止日',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 100,
      render: (deadline: string) => {
        const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (days < 0) return <Tag color="error">已截止</Tag>;
        if (days <= 3) return <Tag color="warning">剩 {days} 天</Tag>;
        return <Tag color="default">{days} 天</Tag>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Application) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/application-new/detail/${record.id}`)}
            />
          </Tooltip>
          {['draft', 'filling', 'pending', 'needs_revision'].includes(record.status) && (
            <Tooltip title="编辑">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => navigate(`/application-new/wizard/${record.id}`)}
              />
            </Tooltip>
          )}
          <Tooltip title="指派">
            <Button
              type="text"
              icon={<UserSwitchOutlined />}
              onClick={() => message.info('指派功能开发中...')}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <Popconfirm
              title="确认删除"
              description="删除后将无法恢复，是否确认？"
              onConfirm={() => {
                deleteApplication(record.id);
                message.success('删除成功');
                loadData();
              }}
            >
              <Tooltip title="删除">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedIds(selectedRowKeys as string[]);
    },
  };

  // 批量操作
  const handleBatchExport = () => {
    message.success(`已导出 ${selectedIds.length} 条记录`);
  };

  const handleBatchRemind = () => {
    message.success(`已发送提醒给 ${selectedIds.length} 条记录`);
  };

  const handleBatchArchive = () => {
    message.success(`已归档 ${selectedIds.length} 条记录`);
    setSelectedIds([]);
  };

  // 清空筛选
  const clearFilter = () => {
    setFilter({});
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>申报列表</Title>
        <Text type="secondary">管理企业全部申报项目</Text>
      </div>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6} lg={5}>
            <Select
              mode="multiple"
              placeholder="政策类型"
              style={{ width: '100%' }}
              allowClear
              maxTagCount={1}
              value={filter.policyTypes}
              onChange={(value) => setFilter(prev => ({ ...prev, policyTypes: value }))}
            >
              {policyTypeOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Select
              mode="multiple"
              placeholder="申报状态"
              style={{ width: '100%' }}
              allowClear
              maxTagCount={1}
              value={filter.statuses}
              onChange={(value) => setFilter(prev => ({ ...prev, statuses: value }))}
            >
              {statusOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => {
                if (dates) {
                  setFilter(prev => ({
                    ...prev,
                    startDate: dates[0]?.format('YYYY-MM-DD'),
                    endDate: dates[1]?.format('YYYY-MM-DD'),
                  }));
                }
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Input
              placeholder="搜索项目名称、编号"
              prefix={<SearchOutlined />}
              allowClear
              value={filter.keyword}
              onChange={(e) => setFilter(prev => ({ ...prev, keyword: e.target.value }))}
            />
          </Col>
          <Col xs={24} lg={3}>
            <Button onClick={clearFilter}>清除筛选</Button>
          </Col>
        </Row>
      </Card>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Checkbox
              indeterminate={selectedIds.length > 0 && selectedIds.length < filteredApps.length}
              checked={selectedIds.length === filteredApps.length && filteredApps.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(filteredApps.map(app => app.id));
                } else {
                  setSelectedIds([]);
                }
              }}
            >
              全选
            </Checkbox>
            {selectedIds.length > 0 && (
              <Text type="secondary">已选择 {selectedIds.length} 项</Text>
            )}
            <Button
              icon={<ExportOutlined />}
              disabled={selectedIds.length === 0}
              onClick={handleBatchExport}
            >
              批量导出
            </Button>
            <Button
              icon={<BellOutlined />}
              disabled={selectedIds.length === 0}
              onClick={handleBatchRemind}
            >
              批量提醒
            </Button>
            <Button
              icon={<FolderOpenOutlined />}
              disabled={selectedIds.length === 0}
              onClick={handleBatchArchive}
            >
              批量归档
            </Button>
          </Space>
          <Space>
            <Button.Group>
              <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('table')}
              >
                列表
              </Button>
              <Button
                type={viewMode === 'card' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('card')}
              >
                卡片
              </Button>
            </Button.Group>
            <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/application-new/wizard')}>
              新建申报
            </Button>
          </Space>
        </div>
      </Card>

      {/* 列表内容 */}
      <Spin spinning={loading}>
        {viewMode === 'table' ? (
          <Card style={{ borderRadius: 8 }}>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredApps}
              rowKey="id"
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        ) : (
          <div>
            {filteredApps.length > 0 ? (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {filteredApps.map(app => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    showCheckbox
                    selected={selectedIds.includes(app.id)}
                    onSelect={(id, selected) => {
                      if (selected) {
                        setSelectedIds(prev => [...prev, id]);
                      } else {
                        setSelectedIds(prev => prev.filter(i => i !== id));
                      }
                    }}
                    onContinue={(id) => navigate(`/application-new/wizard/${id}`)}
                    onView={(id) => navigate(`/application-new/detail/${id}`)}
                    onDelete={(id) => {
                      deleteApplication(id);
                      message.success('删除成功');
                      loadData();
                    }}
                  />
                ))}
              </Space>
            ) : (
              <Card style={{ borderRadius: 8 }}>
                <Empty description="暂无申报项目" />
              </Card>
            )}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ListView;
