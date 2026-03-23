/**
 * 企业认证后信息展示系统 - 类型定义
 * 创建时间: 2026-03-23
 */

// ==================== 审核状态相关 ====================

/** 内容审核状态 */
export type AuditStatus = 'pending' | 'approved' | 'rejected' | 'expired';

/** 审核记录 */
export interface AuditRecord {
  id: string;
  contentId: string;
  contentType: ContentType;
  status: AuditStatus;
  auditor: string;
  auditTime: string;
  reason?: string;
  version: number;
}

/** 内容类型 */
export type ContentType = 
  | 'enterprise_info' 
  | 'recommendation' 
  | 'profile_data' 
  | 'business_data' 
  | 'credit_data';

/** 可审核内容接口 */
export interface AuditableContent {
  id: string;
  auditStatus: AuditStatus;
  auditTime?: string;
  auditor?: string;
  auditRecords: AuditRecord[];
  version: number;
}

// ==================== 企业画像相关 ====================

/** 企业基本信息 */
export interface EnterpriseBasicInfo extends AuditableContent {
  enterpriseId: string;
  name: string;
  unifiedCode: string;
  legalPerson: string;
  registeredCapital: string;
  establishDate: string;
  industry: string;
  scale: string;
  address: string;
  contactPhone: string;
  email: string;
  website?: string;
  businessScope: string;
}

/** 经营状况 */
export interface BusinessStatus extends AuditableContent {
  enterpriseId: string;
  annualRevenue: number;
  employeeCount: number;
  taxCreditLevel: 'A' | 'B' | 'C' | 'D';
  socialSecurityCount: number;
  intellectualPropertyCount: number;
  projectExperienceCount: number;
  lastUpdated: string;
}

/** 信用评级 */
export interface CreditRating extends AuditableContent {
  enterpriseId: string;
  overallScore: number;
  creditLevel: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C';
  evaluationDate: string;
  validUntil: string;
  dimensions: CreditDimension[];
}

/** 信用维度 */
export interface CreditDimension {
  name: string;
  score: number;
  weight: number;
  description: string;
}

/** 完整企业画像 */
export interface EnterpriseProfile {
  basicInfo: EnterpriseBasicInfo;
  businessStatus: BusinessStatus;
  creditRating: CreditRating;
  lastUpdated: string;
  completeness: number;
}

// ==================== 智能推荐相关 ====================

/** 推荐内容类型 */
export type RecommendationType = 
  | 'policy' 
  | 'service' 
  | 'finance' 
  | 'training' 
  | 'partner';

/** 推荐项 */
export interface RecommendationItem extends AuditableContent {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  relevanceScore: number;
  reason: string;
  actionUrl: string;
  actionText: string;
  publishTime: string;
  viewCount: number;
  applyCount: number;
}

/** 推荐分类 */
export interface RecommendationCategory {
  type: RecommendationType;
  name: string;
  icon: string;
  items: RecommendationItem[];
}

/** 推荐配置 */
export interface RecommendationConfig {
  enterpriseId: string;
  categories: RecommendationCategory[];
  lastUpdated: string;
  totalCount: number;
}

// ==================== 认证状态相关 ====================

/** 企业认证状态 */
export interface EnterpriseCertificationStatus {
  enterpriseId: string;
  status: 'unverified' | 'verifying' | 'verified' | 'rejected';
  submitTime?: string;
  verifyTime?: string;
  rejectReason?: string;
  certLevel: 'none' | 'basic' | 'advanced' | 'premium';
  validUntil?: string;
  permissions: string[];
}

/** 认证后首页数据 */
export interface CertifiedHomeData {
  enterprise: EnterpriseProfile;
  certification: EnterpriseCertificationStatus;
  recommendations: RecommendationConfig;
  auditLogs: AuditRecord[];
  notifications: Notification[];
  quickActions: QuickAction[];
}

/** 通知消息 */
export interface Notification {
  id: string;
  type: 'audit' | 'recommendation' | 'system' | 'reminder';
  title: string;
  content: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

/** 快捷操作 */
export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  url: string;
  badge?: number;
  permission?: string;
}

// ==================== 审核管理相关 ====================

/** 审核筛选条件 */
export interface AuditFilter {
  contentType?: ContentType;
  status?: AuditStatus;
  startTime?: string;
  endTime?: string;
  keyword?: string;
}

/** 审核统计 */
export interface AuditStatistics {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  expiredCount: number;
  todayCount: number;
}

/** 审核日志查询参数 */
export interface AuditLogQuery {
  enterpriseId?: string;
  contentType?: ContentType;
  status?: AuditStatus;
  startTime?: string;
  endTime?: string;
  pageNum: number;
  pageSize: number;
}

/** 分页审核日志响应 */
export interface AuditLogResponse {
  total: number;
  pageNum: number;
  pageSize: number;
  list: AuditRecord[];
}
