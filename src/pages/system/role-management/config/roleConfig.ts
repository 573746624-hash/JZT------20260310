/**
 * 角色管理配置
 * @file config/roleConfig.ts
 * @desc 角色管理模块的常量配置
 */

import type { DataScopeOption } from '../types';

/** 数据范围选项配置 */
export const dataScopeOptions: DataScopeOption[] = [
  {
    value: 'all',
    label: '全部数据',
    description: '可查看和管理系统中所有数据',
  },
  {
    value: 'dept',
    label: '本部门数据',
    description: '仅可查看和管理本部门的数据',
  },
  {
    value: 'self',
    label: '仅本人数据',
    description: '仅可查看和管理自己创建的数据',
  },
];

/** 默认角色模板 */
export const defaultRoles = [
  {
    name: '系统管理员',
    code: 'sys_admin',
    description: '拥有系统管理模块的所有权限',
    dataScope: 'all' as const,
  },
  {
    name: '部门管理员',
    code: 'dept_admin',
    description: '可管理部门内用户和数据',
    dataScope: 'dept' as const,
  },
  {
    name: '普通用户',
    code: 'user',
    description: '仅可访问个人中心和相关功能',
    dataScope: 'self' as const,
  },
];

/** 表格列配置 */
export const tableColumns = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '数据范围',
    dataIndex: 'dataScope',
    key: 'dataScope',
    width: 120,
  },
  {
    title: '用户数量',
    dataIndex: 'userCount',
    key: 'userCount',
    width: 100,
    align: 'center' as const,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center' as const,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right' as const,
  },
];

/** 分页配置 */
export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
};
