/**
 * 申报管理仪表盘页面
 * 创建时间: 2026-03-23
 * 功能: 企业级申报事务管理入口，提供数据概览和快捷操作
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  Tooltip,
  Empty,
  Spin,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  ImportOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  FormOutlined,
  RightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useApplications } from '../hooks/useApplications';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import type { ApplicationStatistics, TodoStatistics, RecentApplication } from '../types';

const { Title, Text } = Typography;

const ManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    getStatistics,
    getTodoStatistics,
    getRecentApplications,
    loading,
  } = useApplications();

  const [statistics, setStatistics] = useState<ApplicationStatistics | null>(null);
  const [todoStats, setTodoStats] = useState<TodoStatistics | null>(null);
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 加载数据
  const loadData = async () => {
    setRefreshing(true);
    try {
      const [stats, todo, recent] = await Promise.all([
        getStatistics(),
        getTodoStatistics(),
        getRecentApplications(5),
      ]);
      setStatistics(stats);
      setTodoStats(todo);
      setRecentApps(recent);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 统计卡片数据
  const statCards = [
    { 
      title: '本月新增', 
      value: statistics?.thisMonthCount || 0, 
      icon: <PlusOutlined style={{ color: '#1890ff' }} />,
      color: '#e6f7ff',
      onClick: () => navigate('/application-new/management/list?filter=thisMonth'),
    },
    { 
      title: '进行中', 
      value: statistics?.inProgressCount || 0, 
      icon: <FormOutlined style={{ color: '#722ed1' }} />,
      color: '#f9f0ff',
      onClick: () => navigate('/application-new/management/list?status=inProgress'),
    },
    { 
      title: '待提交', 
      value: statistics?.pendingCount || 0, 
      icon: <ClockCircleOutlined style={{ color: '#fa8c16' }} />,
      color: '#fff7e6',
      onClick: () => navigate('/application-new/management/list?status=pending'),
    },
    { 
      title: '审核中', 
      value: statistics?.reviewingCount || 0, 
      icon: <FileTextOutlined style={{ color: '#1890ff' }} />,
      color: '#e6f7ff',
      onClick: () => navigate('/application-new/management/list?status=reviewing'),
    },
    { 
      title: '需补充', 
      value: statistics?.needsRevisionCount || 0, 
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      color: '#fff1f0',
      onClick: () => navigate('/application-new/management/list?status=needs_revision'),
    },
  ];

  // 趋势图表配置
  const trendChartOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['新建申报', '已通过', '已驳回'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: statistics?.trendData.map(d => d.month) || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新建申报',
        type: 'line',
        smooth: true,
        data: statistics?.trendData.map(d => d.created) || [],
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24,144,255,0.3)' },
              { offset: 1, color: 'rgba(24,144,255,0.05)' },
            ],
          },
        },
      },
      {
        name: '已通过',
        type: 'line',
        smooth: true,
        data: statistics?.trendData.map(d => d.approved) || [],
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '已驳回',
        type: 'line',
        smooth: true,
        data: statistics?.trendData.map(d => d.rejected) || [],
        itemStyle: { color: '#ff4d4f' },
      },
    ],
  };

  // 最近申报表格列
  const recentColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '当前步骤',
      dataIndex: 'currentStep',
      key: 'currentStep',
      width: 120,
      render: (step: number, record: RecentApplication) => (
        <Text>第 {step}/{record.totalSteps} 步</Text>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number, record: RecentApplication) => (
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
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: RecentApplication) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/application-new/wizard/${record.id}`)}
        >
          继续
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>申报管理</Title>
          <Text type="secondary">企业申报事务的统一管理中心</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={refreshing}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/application-new/wizard')}>
            新建申报
          </Button>
        </Space>
      </div>

      <Spin spinning={loading || refreshing}>
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statCards.map((card, index) => (
            <Col xs={12} sm={12} md={8} lg={4} key={index}>
              <Card
                hoverable
                onClick={card.onClick}
                bodyStyle={{ padding: 16, cursor: 'pointer' }}
                style={{ borderRadius: 8 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{card.title}</Text>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#262626' }}>
                      {card.value}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 中部区域：图表 + 快捷操作 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* 趋势图表 */}
          <Col xs={24} lg={16}>
            <Card
              title="申报趋势"
              extra={<Text type="secondary">近6个月</Text>}
              style={{ borderRadius: 8, height: '100%' }}
            >
              <ReactECharts option={trendChartOption} style={{ height: 300 }} />
            </Card>
          </Col>

          {/* 快捷操作 + 待办提醒 */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {/* 快捷操作 */}
              <Card title="快捷操作" style={{ borderRadius: 8 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    block
                    onClick={() => navigate('/application-new/wizard')}
                  >
                    新建申报
                  </Button>
                  <Button icon={<ImportOutlined />} block>
                    导入草稿
                  </Button>
                  <Button icon={<BarChartOutlined />} block onClick={() => navigate('/application-new/management/statistics')}>
                    查看报表
                  </Button>
                  <Button icon={<FolderOpenOutlined />} block>
                    归档管理
                  </Button>
                </Space>
              </Card>

              {/* 待办提醒 */}
              <Card title="待办提醒" style={{ borderRadius: 8 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {todoStats && todoStats.deadlineApproaching > 0 && (
                    <Alert
                      message={`${todoStats.deadlineApproaching} 个申报即将截止`}
                      type="warning"
                      showIcon
                      action={<Button size="small" type="link">查看</Button>}
                    />
                  )}
                  {todoStats && todoStats.needsRevision > 0 && (
                    <Alert
                      message={`${todoStats.needsRevision} 个申报需补充材料`}
                      type="error"
                      showIcon
                      action={<Button size="small" type="link">查看</Button>}
                    />
                  )}
                  {todoStats && todoStats.pendingSubmit > 0 && (
                    <Alert
                      message={`${todoStats.pendingSubmit} 个申报待提交`}
                      type="info"
                      showIcon
                      action={<Button size="small" type="link">查看</Button>}
                    />
                  )}
                  {(!todoStats || (todoStats.deadlineApproaching === 0 && todoStats.needsRevision === 0 && todoStats.pendingSubmit === 0)) && (
                    <Empty description="暂无待办事项" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>

        {/* 最近申报项目 */}
        <Card
          title="最近申报项目"
          extra={
            <Button type="link" onClick={() => navigate('/application-new/management/list')}>
              查看全部 <RightOutlined />
            </Button>
          }
          style={{ borderRadius: 8 }}
        >
          {recentApps.length > 0 ? (
            <Table
              columns={recentColumns}
              dataSource={recentApps}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          ) : (
            <Empty description="暂无申报项目" />
          )}
        </Card>
      </Spin>
    </div>
  );
};

export default ManagementDashboard;
