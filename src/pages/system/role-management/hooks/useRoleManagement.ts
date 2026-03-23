/**
 * 角色管理 Hook
 * @file hooks/useRoleManagement.ts
 * @desc 角色列表查询、分页、状态管理
 */

import { useState, useCallback, useEffect } from 'react';
import type { Role, RoleQueryParams, RoleListResponse } from '../types';

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限',
    permissions: ['*'],
    dataScope: 'all',
    status: true,
    userCount: 1,
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
  },
  {
    id: '2',
    name: '系统管理员',
    code: 'sys_admin',
    description: '负责系统日常管理和维护',
    permissions: ['user:*', 'role:*', 'log:view', 'config:*'],
    dataScope: 'all',
    status: true,
    userCount: 3,
    createdAt: '2026-01-10 10:30:00',
    updatedAt: '2026-01-15 14:20:00',
  },
  {
    id: '3',
    name: '部门管理员',
    code: 'dept_admin',
    description: '管理部门内用户和数据',
    permissions: ['user:view', 'user:edit', 'log:view'],
    dataScope: 'dept',
    status: true,
    userCount: 5,
    createdAt: '2026-01-12 09:00:00',
    updatedAt: '2026-01-12 09:00:00',
  },
  {
    id: '4',
    name: '普通用户',
    code: 'user',
    description: '仅可访问个人中心',
    permissions: ['user:view:self', 'profile:*'],
    dataScope: 'self',
    status: true,
    userCount: 128,
    createdAt: '2026-01-15 08:00:00',
    updatedAt: '2026-01-20 16:30:00',
  },
];

export function useRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<RoleQueryParams>({
    page: 1,
    pageSize: 10,
  });

  // 加载角色列表
  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredRoles = [...mockRoles];
      
      // 关键词筛选
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredRoles = filteredRoles.filter(
          role =>
            role.name.toLowerCase().includes(keyword) ||
            role.code.toLowerCase().includes(keyword) ||
            role.description.toLowerCase().includes(keyword)
        );
      }
      
      // 状态筛选
      if (params.status !== undefined) {
        filteredRoles = filteredRoles.filter(role => role.status === params.status);
      }
      
      setTotal(filteredRoles.length);
      
      // 分页
      const start = ((params.page || 1) - 1) * (params.pageSize || 10);
      const end = start + (params.pageSize || 10);
      setRoles(filteredRoles.slice(start, end));
    } catch (error) {
      console.error('加载角色列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // 搜索
  const handleSearch = useCallback((keyword: string) => {
    setParams(prev => ({ ...prev, keyword, page: 1 }));
  }, []);

  // 分页变化
  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setParams(prev => ({ ...prev, page, pageSize: pageSize || prev.pageSize }));
  }, []);

  // 删除角色
  const deleteRole = useCallback(async (id: string) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      // 重新加载列表
      loadRoles();
      return true;
    } catch (error) {
      console.error('删除角色失败:', error);
      return false;
    }
  }, [loadRoles]);

  // 切换角色状态
  const toggleRoleStatus = useCallback(async (id: string, status: boolean) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      // 更新本地状态
      setRoles(prev =>
        prev.map(role =>
          role.id === id ? { ...role, status } : role
        )
      );
      return true;
    } catch (error) {
      console.error('切换角色状态失败:', error);
      return false;
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return {
    roles,
    loading,
    total,
    params,
    loadRoles,
    handleSearch,
    handlePageChange,
    deleteRole,
    toggleRoleStatus,
  };
}
