/**
 * 企业认证后信息展示系统 - 全局状态管理
 * 创建时间: 2026-03-23
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type {
  EnterpriseProfile,
  EnterpriseCertificationStatus,
  RecommendationConfig,
  AuditRecord,
  Notification,
  QuickAction,
  AuditFilter,
  AuditStatistics,
  AuditLogQuery,
  AuditLogResponse,
  AuditableContent,
  AuditStatus,
} from '../types/enterprise-portal';

// ==================== Context 类型定义 ====================

interface EnterprisePortalContextType {
  // 数据状态
  enterpriseProfile: EnterpriseProfile | null;
  certificationStatus: EnterpriseCertificationStatus | null;
  recommendations: RecommendationConfig | null;
  notifications: Notification[];
  quickActions: QuickAction[];
  auditLogs: AuditRecord[];
  auditStatistics: AuditStatistics | null;
  
  // UI 状态
  loading: boolean;
  error: string | null;
  
  // 操作方法
  refreshProfile: () => Promise<void>;
  refreshRecommendations: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  queryAuditLogs: (query: AuditLogQuery) => Promise<AuditLogResponse>;
  refreshAuditStatistics: () => Promise<void>;
  checkContentAuditStatus: (contentId: string) => AuditStatus | null;
  getAuditHistory: (contentId: string) => AuditRecord[];
  
  // 工具方法
  isContentApproved: (content: AuditableContent) => boolean;
  filterApprovedContent: <T extends AuditableContent>(contents: T[]) => T[];
  getAuditStatusText: (status: AuditStatus) => string;
  getAuditStatusColor: (status: AuditStatus) => string;
}

// ==================== 默认状态 ====================

const defaultContextValue: EnterprisePortalContextType = {
  enterpriseProfile: null,
  certificationStatus: null,
  recommendations: null,
  notifications: [],
  quickActions: [],
  auditLogs: [],
  auditStatistics: null,
  loading: false,
  error: null,
  refreshProfile: async () => {},
  refreshRecommendations: async () => {},
  refreshNotifications: async () => {},
  markNotificationRead: async () => {},
  markAllNotificationsRead: async () => {},
  queryAuditLogs: async () => ({ total: 0, pageNum: 1, pageSize: 10, list: [] }),
  refreshAuditStatistics: async () => {},
  checkContentAuditStatus: () => null,
  getAuditHistory: () => [],
  isContentApproved: () => false,
  filterApprovedContent: () => [],
  getAuditStatusText: () => '',
  getAuditStatusColor: () => '',
};

// ==================== Context 创建 ====================

const EnterprisePortalContext = createContext<EnterprisePortalContextType>(defaultContextValue);

// ==================== Provider 组件 ====================

export const EnterprisePortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 数据状态
  const [enterpriseProfile, setEnterpriseProfile] = useState<EnterpriseProfile | null>(null);
  const [certificationStatus, setCertificationStatus] = useState<EnterpriseCertificationStatus | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationConfig | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [auditStatistics, setAuditStatistics] = useState<AuditStatistics | null>(null);
  
  // UI 状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== 模拟数据生成 ====================
  
  const generateMockProfile = (): EnterpriseProfile => ({
    basicInfo: {
      id: 'basic-001',
      enterpriseId: 'ent-001',
      name: '北京测试科技有限公司',
      unifiedCode: '91110108MA01K2XXXX',
      legalPerson: '王鹏',
      registeredCapital: '1000万元',
      establishDate: '2020-01-15',
      industry: '软件和信息技术服务业',
      scale: 'small',
      address: '北京市海淀区中关村软件园',
      contactPhone: '13800138000',
      email: 'contact@test.com',
      website: 'www.test.com',
      businessScope: '软件开发、技术咨询、技术服务',
      auditStatus: 'approved',
      auditTime: '2026-03-20T10:30:00Z',
      auditor: '系统管理员',
      auditRecords: [],
      version: 1,
    },
    businessStatus: {
      id: 'business-001',
      enterpriseId: 'ent-001',
      annualRevenue: 5000000,
      employeeCount: 45,
      taxCreditLevel: 'A',
      socialSecurityCount: 42,
      intellectualPropertyCount: 12,
      projectExperienceCount: 8,
      lastUpdated: '2026-03-22T08:00:00Z',
      auditStatus: 'approved',
      auditTime: '2026-03-22T10:00:00Z',
      auditor: '系统管理员',
      auditRecords: [],
      version: 1,
    },
    creditRating: {
      id: 'credit-001',
      enterpriseId: 'ent-001',
      overallScore: 85,
      creditLevel: 'AA',
      evaluationDate: '2026-01-15',
      validUntil: '2027-01-15',
      dimensions: [
        { name: '经营状况', score: 88, weight: 0.3, description: '企业营收稳定增长' },
        { name: '纳税信用', score: 95, weight: 0.25, description: '连续三年A级纳税人' },
        { name: '社会信用', score: 82, weight: 0.25, description: '无不良信用记录' },
        { name: '创新能力', score: 78, weight: 0.2, description: '拥有多项知识产权' },
      ],
      auditStatus: 'approved',
      auditTime: '2026-01-15T14:00:00Z',
      auditor: '信用评级机构',
      auditRecords: [],
      version: 1,
    },
    lastUpdated: '2026-03-22T10:00:00Z',
    completeness: 95,
  });

  const generateMockRecommendations = (): RecommendationConfig => ({
    enterpriseId: 'ent-001',
    categories: [
      {
        type: 'policy',
        name: '政策推荐',
        icon: 'FileTextOutlined',
        items: [
          {
            id: 'rec-policy-001',
            type: 'policy',
            title: '高新技术企业认定',
            description: '根据您的企业类型和经营状况，推荐申请高新技术企业认定，可享受税收优惠。',
            tags: ['税收优惠', '资质认定'],
            relevanceScore: 95,
            reason: '匹配度：企业为科技型企业，拥有12项知识产权',
            actionUrl: '/policy-center/detail/001',
            actionText: '查看详情',
            publishTime: '2026-03-20T10:00:00Z',
            viewCount: 1234,
            applyCount: 56,
            auditStatus: 'approved',
            auditTime: '2026-03-20T08:00:00Z',
            auditor: '内容审核员',
            auditRecords: [],
            version: 1,
          },
          {
            id: 'rec-policy-002',
            type: 'policy',
            title: '研发费用加计扣除',
            description: '您的企业研发投入较高，建议申请研发费用加计扣除政策。',
            tags: ['税收优惠', '研发支持'],
            relevanceScore: 88,
            reason: '匹配度：企业研发投入占比超过10%',
            actionUrl: '/policy-center/detail/002',
            actionText: '查看详情',
            publishTime: '2026-03-18T14:00:00Z',
            viewCount: 892,
            applyCount: 34,
            auditStatus: 'approved',
            auditTime: '2026-03-18T10:00:00Z',
            auditor: '内容审核员',
            auditRecords: [],
            version: 1,
          },
        ],
      },
      {
        type: 'finance',
        name: '金融服务',
        icon: 'BankOutlined',
        items: [
          {
            id: 'rec-finance-001',
            type: 'finance',
            title: '信用贷款服务',
            description: '基于您企业的AA级信用评级，推荐申请无抵押信用贷款。',
            tags: ['信用贷款', '低利率'],
            relevanceScore: 92,
            reason: '匹配度：企业信用评级良好，经营状况稳定',
            actionUrl: '/supply-chain-finance/loan',
            actionText: '立即申请',
            publishTime: '2026-03-21T09:00:00Z',
            viewCount: 567,
            applyCount: 23,
            auditStatus: 'approved',
            auditTime: '2026-03-21T08:00:00Z',
            auditor: '金融审核员',
            auditRecords: [],
            version: 1,
          },
        ],
      },
      {
        type: 'service',
        name: '企业服务',
        icon: 'ToolOutlined',
        items: [
          {
            id: 'rec-service-001',
            type: 'service',
            title: '知识产权服务',
            description: '为您提供专业的知识产权申请、维护服务。',
            tags: ['知识产权', '专业服务'],
            relevanceScore: 85,
            reason: '匹配度：企业已有12项知识产权，需要专业维护',
            actionUrl: '/industry/service-match/ip-service',
            actionText: '了解服务',
            publishTime: '2026-03-19T11:00:00Z',
            viewCount: 445,
            applyCount: 12,
            auditStatus: 'approved',
            auditTime: '2026-03-19T10:00:00Z',
            auditor: '服务审核员',
            auditRecords: [],
            version: 1,
          },
        ],
      },
    ],
    lastUpdated: '2026-03-22T10:00:00Z',
    totalCount: 4,
  });

  const generateMockNotifications = (): Notification[] => [
    {
      id: 'notif-001',
      type: 'audit',
      title: '企业信息审核通过',
      content: '您的企业基本信息已通过平台审核',
      time: '2026-03-20T10:30:00Z',
      read: false,
      actionUrl: '/enterprise/profile',
    },
    {
      id: 'notif-002',
      type: 'recommendation',
      title: '新的政策推荐',
      content: '根据您的企业情况，为您推荐高新技术企业认定政策',
      time: '2026-03-21T09:00:00Z',
      read: false,
      actionUrl: '/policy-center/detail/001',
    },
    {
      id: 'notif-003',
      type: 'system',
      title: '信用评级更新',
      content: '您的企业信用评级已更新为AA级',
      time: '2026-03-22T08:00:00Z',
      read: true,
    },
  ];

  const generateMockQuickActions = (): QuickAction[] => [
    { id: 'action-001', name: '政策申报', icon: 'FileTextOutlined', url: '/policy-center', badge: 2 },
    { id: 'action-002', name: '服务匹配', icon: 'ToolOutlined', url: '/industry/service-match' },
    { id: 'action-003', name: '金融服务', icon: 'BankOutlined', url: '/supply-chain-finance' },
    { id: 'action-004', name: '法律支持', icon: 'SafetyOutlined', url: '/legal-support' },
    { id: 'action-005', name: '企业画像', icon: 'IdcardOutlined', url: '/enterprise/profile' },
    { id: 'action-006', name: '审核记录', icon: 'AuditOutlined', url: '/enterprise/audit-logs' },
  ];

  const generateMockAuditLogs = (): AuditRecord[] => [
    {
      id: 'audit-001',
      contentId: 'basic-001',
      contentType: 'enterprise_info',
      status: 'approved',
      auditor: '系统管理员',
      auditTime: '2026-03-20T10:30:00Z',
      version: 1,
    },
    {
      id: 'audit-002',
      contentId: 'business-001',
      contentType: 'business_data',
      status: 'approved',
      auditor: '系统管理员',
      auditTime: '2026-03-22T10:00:00Z',
      version: 1,
    },
    {
      id: 'audit-003',
      contentId: 'credit-001',
      contentType: 'credit_data',
      status: 'approved',
      auditor: '信用评级机构',
      auditTime: '2026-01-15T14:00:00Z',
      version: 1,
    },
    {
      id: 'audit-004',
      contentId: 'rec-policy-001',
      contentType: 'recommendation',
      status: 'approved',
      auditor: '内容审核员',
      auditTime: '2026-03-20T08:00:00Z',
      version: 1,
    },
  ];

  const generateMockAuditStatistics = (): AuditStatistics => ({
    totalCount: 15,
    pendingCount: 0,
    approvedCount: 14,
    rejectedCount: 1,
    expiredCount: 0,
    todayCount: 2,
  });

  // ==================== 数据加载方法 ====================

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 800));
      setEnterpriseProfile(generateMockProfile());
    } catch (err) {
      setError('加载企业画像失败');
      message.error('加载企业画像失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setRecommendations(generateMockRecommendations());
    } catch (err) {
      message.error('加载推荐内容失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setNotifications(generateMockNotifications());
    } catch (err) {
      console.error('加载通知失败', err);
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    message.success('已全部标记为已读');
  }, []);

  const queryAuditLogs = useCallback(async (query: AuditLogQuery): Promise<AuditLogResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const allLogs = generateMockAuditLogs();
    let filtered = allLogs;
    
    if (query.contentType) {
      filtered = filtered.filter(log => log.contentType === query.contentType);
    }
    if (query.status) {
      filtered = filtered.filter(log => log.status === query.status);
    }
    if (query.startTime && query.endTime) {
      filtered = filtered.filter(log => 
        log.auditTime >= query.startTime! && log.auditTime <= query.endTime!
      );
    }
    
    const start = (query.pageNum - 1) * query.pageSize;
    const end = start + query.pageSize;
    
    return {
      total: filtered.length,
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      list: filtered.slice(start, end),
    };
  }, []);

  const refreshAuditStatistics = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAuditStatistics(generateMockAuditStatistics());
    } catch (err) {
      console.error('加载审核统计失败', err);
    }
  }, []);

  // ==================== 工具方法 ====================

  const checkContentAuditStatus = useCallback((contentId: string): AuditStatus | null => {
    const log = auditLogs.find(l => l.contentId === contentId);
    return log?.status || null;
  }, [auditLogs]);

  const getAuditHistory = useCallback((contentId: string): AuditRecord[] => {
    return auditLogs.filter(l => l.contentId === contentId);
  }, [auditLogs]);

  const isContentApproved = useCallback((content: AuditableContent): boolean => {
    return content.auditStatus === 'approved';
  }, []);

  const filterApprovedContent = useCallback(<T extends AuditableContent>(contents: T[]): T[] => {
    return contents.filter(c => c.auditStatus === 'approved');
  }, []);

  const getAuditStatusText = useCallback((status: AuditStatus): string => {
    const statusMap: Record<AuditStatus, string> = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已驳回',
      expired: '已过期',
    };
    return statusMap[status] || '未知';
  }, []);

  const getAuditStatusColor = useCallback((status: AuditStatus): string => {
    const colorMap: Record<AuditStatus, string> = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      expired: 'gray',
    };
    return colorMap[status] || 'default';
  }, []);

  // ==================== 初始化 ====================

  useEffect(() => {
    // 初始化加载所有数据
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([
          refreshProfile(),
          refreshRecommendations(),
          refreshNotifications(),
          refreshAuditStatistics(),
        ]);
        setAuditLogs(generateMockAuditLogs());
        setQuickActions(generateMockQuickActions());
        
        // 设置认证状态
        setCertificationStatus({
          enterpriseId: 'ent-001',
          status: 'verified',
          verifyTime: '2026-03-20T10:30:00Z',
          certLevel: 'advanced',
          validUntil: '2027-03-20T10:30:00Z',
          permissions: ['policy', 'service', 'finance', 'legal', 'profile'],
        });
      } catch (err) {
        console.error('初始化失败', err);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  // ==================== 值组装 ====================

  const value: EnterprisePortalContextType = {
    enterpriseProfile,
    certificationStatus,
    recommendations,
    notifications,
    quickActions,
    auditLogs,
    auditStatistics,
    loading,
    error,
    refreshProfile,
    refreshRecommendations,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    queryAuditLogs,
    refreshAuditStatistics,
    checkContentAuditStatus,
    getAuditHistory,
    isContentApproved,
    filterApprovedContent,
    getAuditStatusText,
    getAuditStatusColor,
  };

  return (
    <EnterprisePortalContext.Provider value={value}>
      {children}
    </EnterprisePortalContext.Provider>
  );
};

// ==================== Hook ====================

export const useEnterprisePortal = () => {
  const context = useContext(EnterprisePortalContext);
  if (!context) {
    throw new Error('useEnterprisePortal must be used within EnterprisePortalProvider');
  }
  return context;
};

export default EnterprisePortalContext;
