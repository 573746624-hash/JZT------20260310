/**
 * 申报管理仪表盘页面
 * 创建时间: 2026-03-23
 * 功能: 企业级申报事务管理入口，提供数据概览和快捷操作
 * 位置: 政策中心 -> 申报管理
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
  RightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useApplications } from './hooks/useApplications';
import { StatusBadge } from './components/StatusBadge';
import ProgressBar from './components/ProgressBar';
import type { ApplicationStatistics, TodoStatistics, RecentApplication } from './types';

const { Title, Text } = Typography;

const ApplicationManagementDashboard: React.FC = () => {
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
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 120,
      render: (deadline: string) => {
        const date = new Date(deadline);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (days < 0) {
          return (
            <div>
              <div>{formattedDate}</div>
              <Tag color="error">已截止</Tag>
            </div>
          );
        }
        if (days <= 3) {
          return (
            <div>
              <div>{formattedDate}</div>
              <Tag color="warning">剩 {days} 天</Tag>
            </div>
          );
        }
        return <div>{formattedDate}</div>;
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
          onClick={() => navigate(`/application/apply/${record.id}`)}
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/application?view=list')}>
            新建申报
          </Button>
        </Space>
      </div>

      <Spin spinning={loading || refreshing}>
        {/* 申报趋势图表 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card
              title="申报趋势"
              extra={<Text type="secondary">近6个月</Text>}
              style={{ borderRadius: 8 }}
            >
              <ReactECharts option={trendChartOption} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>

        {/* 待办提醒 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card title="待办提醒" style={{ borderRadius: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {todoStats && todoStats.deadlineApproaching > 0 && (
                  <Alert
                    message={`${todoStats.deadlineApproaching} 个申报即将截止`}
                    type="warning"
                    showIcon
                    action={<Button size="small" type="link" onClick={() => navigate('/application?view=status')}>查看</Button>}
                  />
                )}
                {todoStats && todoStats.needsRevision > 0 && (
                  <Alert
                    message={`${todoStats.needsRevision} 个申报需补充材料`}
                    type="error"
                    showIcon
                    action={<Button size="small" type="link" onClick={() => navigate('/application?view=status')}>查看</Button>}
                  />
                )}
                {todoStats && todoStats.pendingSubmit > 0 && (
                  <Alert
                    message={`${todoStats.pendingSubmit} 个申报待提交`}
                    type="info"
                    showIcon
                    action={<Button size="small" type="link" onClick={() => navigate('/application?view=status')}>查看</Button>}
                  />
                )}
                {(!todoStats || (todoStats.deadlineApproaching === 0 && todoStats.needsRevision === 0 && todoStats.pendingSubmit === 0)) && (
                  <Empty description="暂无待办事项" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 最近申报项目 */}
        <Card
          title="最近申报项目"
          extra={
            <Button type="link" onClick={() => navigate('/application?view=status')}>
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

export default ApplicationManagementDashboard;
