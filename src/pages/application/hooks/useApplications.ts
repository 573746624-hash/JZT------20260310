/**
 * 申报数据管理 Hook
 * 创建时间: 2026-03-23
 */

import { useState, useCallback, useEffect } from 'react';
import type { 
  Application, 
  ApplicationFilter, 
  PaginationParams,
  ApplicationStatistics,
  TodoStatistics,
  RecentApplication
} from '../types';

// Mock 数据
const mockApplications: Application[] = [
  {
    id: 'app-001',
    projectNo: 'APP-2026-0323-001',
    name: '2026年度高新技术企业认定',
    policyId: 'policy-001',
    policyName: '高新技术企业认定',
    enterpriseId: 'ent-001',
    enterpriseName: '深圳市创新科技有限公司',
    applicantId: 'user-001',
    applicantName: '张三',
    status: 'reviewing',
    currentStep: 5,
    totalSteps: 5,
    progress: 80,
    auditStage: 'substantive_review',
    createTime: '2026-03-20 10:30:00',
    updateTime: '2026-03-23 14:20:00',
    submitTime: '2026-03-23 10:00:00',
    deadline: '2026-04-01',
    basicInfo: {
      companyName: '深圳市创新科技有限公司',
      creditCode: '91440300MA5GXXXXXX',
      legalPerson: '张三',
      registeredCapital: '1000万元',
      establishDate: '2020-03-15',
      industry: '软件和信息技术服务业',
      scale: '中型企业',
      address: '深圳市南山区科技园',
      businessScope: '软件开发、技术咨询',
    },
    qualifications: ['high_tech', 'innovation'],
    materials: [],
    contactInfo: {
      contactName: '张三',
      contactPhone: '13800138000',
      contactEmail: 'zhangsan@example.com',
    },
  },
  {
    id: 'app-002',
    projectNo: 'APP-2026-0322-002',
    name: '北京市专精特新中小企业申报',
    policyId: 'policy-002',
    policyName: '专精特新中小企业认定',
    enterpriseId: 'ent-001',
    enterpriseName: '深圳市创新科技有限公司',
    applicantId: 'user-001',
    applicantName: '张三',
    status: 'filling',
    currentStep: 1,
    totalSteps: 5,
    progress: 20,
    createTime: '2026-03-22 09:00:00',
    updateTime: '2026-03-23 11:30:00',
    deadline: '2026-03-30',
    basicInfo: {
      companyName: '深圳市创新科技有限公司',
      creditCode: '91440300MA5GXXXXXX',
      legalPerson: '张三',
      registeredCapital: '1000万元',
      establishDate: '2020-03-15',
      industry: '软件和信息技术服务业',
      scale: '中型企业',
      address: '深圳市南山区科技园',
      businessScope: '软件开发、技术咨询',
    },
    qualifications: ['specialized', 'innovation'],
    materials: [],
    contactInfo: {
      contactName: '张三',
      contactPhone: '13800138000',
      contactEmail: 'zhangsan@example.com',
    },
  },
  {
    id: 'app-003',
    projectNo: 'APP-2026-0315-003',
    name: '科技型中小企业评价',
    policyId: 'policy-003',
    policyName: '科技型中小企业评价',
    enterpriseId: 'ent-001',
    enterpriseName: '深圳市创新科技有限公司',
    applicantId: 'user-002',
    applicantName: '李四',
    status: 'approved',
    currentStep: 5,
    totalSteps: 5,
    progress: 100,
    auditStage: 'result_publicity',
    createTime: '2026-03-15 14:00:00',
    updateTime: '2026-03-20 16:00:00',
    submitTime: '2026-03-16 10:00:00',
    deadline: '2026-03-31',
    basicInfo: {
      companyName: '深圳市创新科技有限公司',
      creditCode: '91440300MA5GXXXXXX',
      legalPerson: '张三',
      registeredCapital: '1000万元',
      establishDate: '2020-03-15',
      industry: '软件和信息技术服务业',
      scale: '中型企业',
      address: '深圳市南山区科技园',
      businessScope: '软件开发、技术咨询',
    },
    qualifications: ['tech_sme'],
    materials: [],
    contactInfo: {
      contactName: '李四',
      contactPhone: '13900139000',
      contactEmail: 'lisi@example.com',
    },
  },
  {
    id: 'app-004',
    projectNo: 'APP-2026-0321-004',
    name: '研发费用加计扣除',
    policyId: 'policy-004',
    policyName: '研发费用加计扣除',
    enterpriseId: 'ent-001',
    enterpriseName: '深圳市创新科技有限公司',
    applicantId: 'user-001',
    applicantName: '张三',
    status: 'needs_revision',
    currentStep: 5,
    totalSteps: 5,
    progress: 60,
    auditStage: 'formal_review',
    createTime: '2026-03-21 10:00:00',
    updateTime: '2026-03-23 09:00:00',
    submitTime: '2026-03-22 14:00:00',
    deadline: '2026-04-05',
    basicInfo: {
      companyName: '深圳市创新科技有限公司',
      creditCode: '91440300MA5GXXXXXX',
      legalPerson: '张三',
      registeredCapital: '1000万元',
      establishDate: '2020-03-15',
      industry: '软件和信息技术服务业',
      scale: '中型企业',
      address: '深圳市南山区科技园',
      businessScope: '软件开发、技术咨询',
    },
    qualifications: ['rd_expense'],
    materials: [],
    contactInfo: {
      contactName: '张三',
      contactPhone: '13800138000',
      contactEmail: 'zhangsan@example.com',
    },
    auditOpinion: '财务审计报告缺失页码，请重新上传清晰扫描件。',
  },
];

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    current: 1,
    pageSize: 10,
    total: mockApplications.length,
  });

  // 获取申报列表
  const fetchApplications = useCallback(async (filter?: ApplicationFilter) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...applications];
      
      if (filter) {
        if (filter.statuses?.length) {
          filtered = filtered.filter(app => filter.statuses?.includes(app.status));
        }
        if (filter.keyword) {
          const keyword = filter.keyword.toLowerCase();
          filtered = filtered.filter(app => 
            app.name.toLowerCase().includes(keyword) ||
            app.projectNo.toLowerCase().includes(keyword) ||
            app.policyName.toLowerCase().includes(keyword)
          );
        }
        if (filter.applicantId) {
          filtered = filtered.filter(app => app.applicantId === filter.applicantId);
        }
      }
      
      return filtered;
    } finally {
      setLoading(false);
    }
  }, [applications]);

  // 获取申报详情
  const getApplication = useCallback((id: string) => {
    return applications.find(app => app.id === id);
  }, [applications]);

  // 创建申报
  const createApplication = useCallback(async (data: Partial<Application>) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      projectNo: `APP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(applications.length + 1).padStart(3, '0')}`,
      name: data.name || '新建申报',
      policyId: data.policyId || '',
      policyName: data.policyName || '',
      enterpriseId: 'ent-001',
      enterpriseName: '深圳市创新科技有限公司',
      applicantId: 'user-001',
      applicantName: '张三',
      status: 'draft',
      currentStep: 1,
      totalSteps: 5,
      progress: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      deadline: data.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      basicInfo: data.basicInfo || {} as any,
      qualifications: data.qualifications || [],
      materials: [],
      contactInfo: data.contactInfo || {} as any,
    };
    
    setApplications(prev => [newApp, ...prev]);
    return newApp;
  }, [applications.length]);

  // 更新申报
  const updateApplication = useCallback((id: string, data: Partial<Application>) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, ...data, updateTime: new Date().toISOString() }
          : app
      )
    );
  }, []);

  // 删除申报
  const deleteApplication = useCallback((id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  }, []);

  // 提交申报
  const submitApplication = useCallback((id: string) => {
    updateApplication(id, {
      status: 'reviewing',
      submitTime: new Date().toISOString(),
      currentStep: 5,
      progress: 80,
    });
  }, [updateApplication]);

  // 获取统计数据
  const getStatistics = useCallback(async (): Promise<ApplicationStatistics> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalCount = applications.length;
    const thisMonthCount = applications.filter(app => 
      app.createTime.startsWith(new Date().toISOString().slice(0, 7))
    ).length;
    const inProgressCount = applications.filter(app => 
      ['filling', 'pending', 'reviewing'].includes(app.status)
    ).length;
    const pendingCount = applications.filter(app => app.status === 'pending').length;
    const reviewingCount = applications.filter(app => app.status === 'reviewing').length;
    const needsRevisionCount = applications.filter(app => app.status === 'needs_revision').length;
    const approvedCount = applications.filter(app => app.status === 'approved').length;
    const rejectedCount = applications.filter(app => app.status === 'rejected').length;
    
    return {
      totalCount,
      thisMonthCount,
      inProgressCount,
      pendingCount,
      reviewingCount,
      needsRevisionCount,
      approvedCount,
      rejectedCount,
      trendData: [
        { month: '2025-10', created: 8, approved: 5, rejected: 1 },
        { month: '2025-11', created: 12, approved: 8, rejected: 2 },
        { month: '2025-12', created: 10, approved: 7, rejected: 1 },
        { month: '2026-01', created: 15, approved: 10, rejected: 2 },
        { month: '2026-02', created: 18, approved: 12, rejected: 3 },
        { month: '2026-03', created: thisMonthCount, approved: approvedCount, rejected: rejectedCount },
      ],
      typeDistribution: [
        { type: '高新技术企业认定', count: 15, percentage: 35 },
        { type: '专精特新中小企业', count: 12, percentage: 28 },
        { type: '科技型中小企业', count: 8, percentage: 19 },
        { type: '研发费用加计扣除', count: 5, percentage: 12 },
        { type: '其他', count: 3, percentage: 6 },
      ],
      statusDistribution: [
        { status: 'draft', count: 2, percentage: 5 },
        { status: 'filling', count: 5, percentage: 12 },
        { status: 'pending', count: 3, percentage: 7 },
        { status: 'reviewing', count: 15, percentage: 35 },
        { status: 'needs_revision', count: 4, percentage: 9 },
        { status: 'approved', count: 12, percentage: 28 },
        { status: 'rejected', count: 2, percentage: 4 },
      ],
    };
  }, [applications]);

  // 获取待办统计
  const getTodoStatistics = useCallback(async (): Promise<TodoStatistics> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return {
      pendingSubmit: applications.filter(app => app.status === 'pending').length,
      reviewing: applications.filter(app => app.status === 'reviewing').length,
      needsRevision: applications.filter(app => app.status === 'needs_revision').length,
      deadlineApproaching: applications.filter(app => {
        const deadline = new Date(app.deadline);
        // 修复边界条件：将 now 的时间重置为当天的 00:00:00，避免遗漏今天到期的项目
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        return deadline <= threeDaysLater && deadline >= todayStart;
      }).length,
    };
  }, [applications]);

  // 获取最近申报
  const getRecentApplications = useCallback(async (limit: number = 5): Promise<RecentApplication[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return applications
      .sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
      .slice(0, limit)
      .map(app => ({
        id: app.id,
        name: app.name,
        currentStep: app.currentStep,
        totalSteps: app.totalSteps,
        progress: app.progress,
        status: app.status,
        deadline: app.deadline,
        updateTime: app.updateTime,
      }));
  }, [applications]);

  return {
    applications,
    loading,
    pagination,
    setPagination,
    fetchApplications,
    getApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    submitApplication,
    getStatistics,
    getTodoStatistics,
    getRecentApplications,
  };
};
