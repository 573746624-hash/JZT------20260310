/**
 * 角色管理类型定义
 * @file types/index.ts
 * @desc 角色、权限、数据范围等类型定义
 */

/** 数据范围枚举 */
export enum DataScope {
  ALL = 'all',
  DEPT = 'dept',
  SELF = 'self',
}

/** 权限类型 */
export type PermissionType = 'menu' | 'button' | 'api';

/** 权限 */
export interface Permission {
  id: string;
  name: string;
  code: string;
  type: PermissionType;
  parentId: string | null;
  path: string;
  sort: number;
  children?: Permission[];
}

/** 角色 */
export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  dataScope: DataScope;
  status: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 角色表单数据 */
export interface RoleFormData {
  name: string;
  code: string;
  description: string;
  permissions: string[];
  dataScope: DataScope;
  status: boolean;
}

/** 角色查询参数 */
export interface RoleQueryParams {
  keyword?: string;
  status?: boolean;
  page?: number;
  pageSize?: number;
}

/** 角色列表响应 */
export interface RoleListResponse {
  list: Role[];
  total: number;
}

/** 权限树节点 */
export interface PermissionTreeNode extends Permission {
  key: string;
  title: string;
  children?: PermissionTreeNode[];
}

/** 数据范围选项 */
export interface DataScopeOption {
  value: DataScope;
  label: string;
  description: string;
}
