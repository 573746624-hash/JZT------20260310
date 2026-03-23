/**
 * 申报管理模块 - 类型定义
 * 创建时间: 2026-03-23
 */

/** 申报状态 */
export type ApplicationStatus = 
  | 'draft'           // 草稿
  | 'filling'         // 填写中
  | 'pending'         // 待提交
  | 'reviewing'       // 审核中
  | 'needs_revision'  // 需补充
  | 'approved'        // 已通过
  | 'rejected'        // 已驳回
  | 'withdrawn'       // 已撤回
  | 'archived';       // 已归档

/** 审核阶段 */
export type AuditStage = 
  | 'submitted'       // 已提交
  | 'formal_review'   // 形式审查
  | 'substantive_review' // 实质审核
  | 'result_publicity'; // 结果公示

/** 申报项目 */
export interface Application {
  id: string;
  projectNo: string;
  name: string;
  policyId: string;
  policyName: string;
  enterpriseId: string;
  enterpriseName: string;
  applicantId: string;
  applicantName: string;
  
  // 状态信息
  status: ApplicationStatus;
  currentStep: number;
  totalSteps: number;
  progress: number;
  auditStage?: AuditStage;
  
  // 时间信息
  createTime: string;
  updateTime: string;
  submitTime?: string;
  deadline: string;
  
  // 内容信息
  basicInfo: ApplicationBasicInfo;
  qualifications: string[];
  materials: ApplicationMaterial[];
  contactInfo: ContactInfo;
  
  // 审核信息
  auditLogs?: AuditLog[];
  auditOpinion?: string;
  auditor?: string;
  auditorName?: string;
}

/** 申报基础信息 */
export interface ApplicationBasicInfo {
  companyName: string;
  creditCode: string;
  legalPerson: string;
  registeredCapital: string;
  establishDate: string;
  industry: string;
  scale: string;
  address: string;
  businessScope: string;
}

/** 申报材料 */
export interface ApplicationMaterial {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  templateUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadTime?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

/** 联系人信息 */
export interface ContactInfo {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  department?: string;
  teamMembers?: TeamMember[];
}

/** 团队成员 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
}

/** 审核记录 */
export interface AuditLog {
  id: string;
  stage: AuditStage;
  action: string;
  operator: string;
  operatorName: string;
  operateTime: string;
  opinion?: string;
  attachments?: string[];
}

/** 申报统计 */
export interface ApplicationStatistics {
  totalCount: number;
  thisMonthCount: number;
  inProgressCount: number;
  pendingCount: number;
  reviewingCount: number;
  needsRevisionCount: number;
  approvedCount: number;
  rejectedCount: number;
  
  // 趋势数据
  trendData: {
    month: string;
    created: number;
    approved: number;
    rejected: number;
  }[];
  
  // 类型分布
  typeDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  
  // 状态分布
  statusDistribution: {
    status: ApplicationStatus;
    count: number;
    percentage: number;
  }[];
}

/** 筛选条件 */
export interface ApplicationFilter {
  policyTypes?: string[];
  statuses?: ApplicationStatus[];
  startDate?: string;
  endDate?: string;
  applicantId?: string;
  keyword?: string;
}

/** 分页参数 */
export interface PaginationParams {
  current: number;
  pageSize: number;
  total: number;
}

/** 向导步骤 */
export interface WizardStep {
  key: string;
  title: string;
  description: string;
  component: React.ComponentType;
}

/** 待办统计 */
export interface TodoStatistics {
  pendingSubmit: number;
  reviewing: number;
  needsRevision: number;
  deadlineApproaching: number;
}

/** 最近申报项目 */
export interface RecentApplication {
  id: string;
  name: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  status: ApplicationStatus;
  deadline: string;
  updateTime: string;
}
