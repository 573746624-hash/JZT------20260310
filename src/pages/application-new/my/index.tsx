/**
 * 我的申报首页
 * 创建时间: 2026-03-23
 * 功能: 个人申报事项的追踪中心，聚焦待办和个人进度
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Empty,
  Spin,
  Badge,
  Tabs,
  Input,
  Select,
} from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  SaveOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useApplications } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import type { Application, ApplicationStatus, TodoStatistics } from '../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  const {
    applications,
    loading,
    getTodoStatistics,
    fetchApplications,
  } = useApplications();

  const [todoStats, setTodoStats] = useState<TodoStatistics | null>(null);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<string>('updateTime');

  // 加载待办统计
  useEffect(() => {
    const loadTodoStats = async () => {
      const stats = await getTodoStatistics();
      setTodoStats(stats);
    };
    loadTodoStats();
  }, [getTodoStatistics]);

  // 筛选和排序
  useEffect(() => {
    let filtered = [...applications];

    // 根据Tab筛选
    switch (activeTab) {
      case 'pending_submit':
        filtered = filtered.filter(app => app.status === 'pending');
        break;
      case 'reviewing':
        filtered = filtered.filter(app => app.status === 'reviewing');
        break;
      case 'needs_revision':
        filtered = filtered.filter(app => app.status === 'needs_revision');
        break;
      case 'deadline': {
        const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(app => {
          const deadline = new Date(app.deadline);
          return deadline <= threeDaysLater && deadline >= new Date();
        });
        break;
      }
      case 'draft':
        filtered = filtered.filter(app => app.status === 'draft' || app.status === 'filling');
        break;
      default:
        break;
    }

    // 搜索筛选
    if (searchText) {
      const keyword = searchText.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(keyword) ||
        app.projectNo.toLowerCase().includes(keyword) ||
        app.policyName.toLowerCase().includes(keyword)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updateTime':
          return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
        case 'createTime':
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

    setFilteredApps(filtered);
  }, [applications, activeTab, searchText, sortBy]);

  // 待办卡片数据
  const todoCards = [
    {
      key: 'pending_submit',
      title: '待提交',
      count: todoStats?.pendingSubmit || 0,
      icon: <FormOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fff7e6',
      description: '已填写但未提交',
    },
    {
      key: 'reviewing',
      title: '审核中',
      count: todoStats?.reviewing || 0,
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#e6f7ff',
      description: '正在审核中',
    },
    {
      key: 'needs_revision',
      title: '需补充',
      count: todoStats?.needsRevision || 0,
      icon: <ExclamationCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />,
      color: '#fff1f0',
      description: '需要补充材料',
    },
    {
      key: 'deadline',
      title: '即将截止',
      count: todoStats?.deadlineApproaching || 0,
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#f9f0ff',
      description: '3天内截止',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>我的申报</Title>
        <Text type="secondary">追踪个人申报进度，处理待办事项</Text>
      </div>

      <Spin spinning={loading}>
        {/* 待办卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {todoCards.map((card) => (
            <Col xs={12} sm={12} md={6} key={card.key}>
              <Card
                hoverable
                onClick={() => setActiveTab(card.key)}
                style={{
                  borderRadius: 8,
                  borderColor: activeTab === card.key ? '#1890ff' : undefined,
                  backgroundColor: activeTab === card.key ? '#e6f7ff' : undefined,
                }}
                bodyStyle={{ padding: 16 }}
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
                    }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>{card.title}</Text>
                      {card.count > 0 && (
                        <Badge count={card.count} style={{ backgroundColor: '#ff4d4f' }} />
                      )}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#262626' }}>
                      {card.count}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{card.description}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 快捷操作 */}
        <Card style={{ marginBottom: 24, borderRadius: 8 }}>
          <Space size={16} wrap>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/application-new/wizard')}
            >
              新建申报
            </Button>
            <Button
              size="large"
              icon={<FileTextOutlined />}
              onClick={() => setActiveTab('all')}
            >
              查看全部
            </Button>
            <Button
              size="large"
              icon={<SaveOutlined />}
              onClick={() => setActiveTab('draft')}
            >
              草稿箱
            </Button>
            <Button
              size="large"
              icon={<HistoryOutlined />}
              onClick={() => navigate('/application-new/my/history')}
            >
              历史记录
            </Button>
          </Space>
        </Card>

        {/* 申报列表 */}
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>我的申报</span>
              <Space>
                <Input
                  placeholder="搜索申报项目"
                  prefix={<SearchOutlined />}
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 240 }}
                />
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 120 }}
                >
                  <Option value="updateTime">最近更新</Option>
                  <Option value="createTime">最近创建</Option>
                  <Option value="deadline">截止日期</Option>
                </Select>
              </Space>
            </div>
          }
          style={{ borderRadius: 8 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ marginTop: -16 }}
          >
            <TabPane tab="全部" key="all" />
            <TabPane tab="草稿" key="draft" />
            <TabPane tab="进行中" key="in_progress" />
            <TabPane tab="已提交" key="submitted" />
            <TabPane tab="已完成" key="completed" />
          </Tabs>

          {filteredApps.length > 0 ? (
            <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 16 }}>
              {filteredApps.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onContinue={(id) => navigate(`/application-new/wizard/${id}`)}
                  onView={(id) => navigate(`/application-new/detail/${id}`)}
                  onDelete={(id) => {
                    // 删除逻辑
                  }}
                  onContact={(id) => {
                    // 联系客服
                  }}
                />
              ))}
            </Space>
          ) : (
            <Empty
              description={
                <Space direction="vertical" align="center">
                  <Text>暂无申报项目</Text>
                  <Button type="primary" onClick={() => navigate('/application-new/wizard')}>
                    立即新建申报
                  </Button>
                </Space>
              }
              style={{ padding: '48px 0' }}
            />
          )}
        </Card>
      </Spin>
    </div>
  );
};

export default MyApplications;
