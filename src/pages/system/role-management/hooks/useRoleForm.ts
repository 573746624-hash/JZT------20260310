/**
 * 角色表单 Hook
 * @file hooks/useRoleForm.ts
 * @desc 角色创建、编辑表单逻辑
 */

import { useState, useCallback } from 'react';
import { Form } from 'antd';
import { DataScope } from '../types';
import type { Role, RoleFormData } from '../types';

export function useRoleForm(onSuccess: () => void) {
  const [form] = Form.useForm<RoleFormData>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 打开新增弹窗
  const handleAdd = useCallback(() => {
    setEditingRole(null);
    form.resetFields();
    form.setFieldsValue({
      status: true,
      dataScope: DataScope.SELF,
      permissions: [],
    });
    setIsModalVisible(true);
  }, [form]);

  // 打开编辑弹窗
  const handleEdit = useCallback((role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description,
      permissions: role.permissions,
      dataScope: role.dataScope,
      status: role.status,
    });
    setIsModalVisible(true);
  }, [form]);

  // 关闭弹窗
  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setEditingRole(null);
    form.resetFields();
  }, [form]);

  // 提交表单
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (editingRole) {
        // 编辑模式
        console.log('更新角色:', editingRole.id, values);
      } else {
        // 新增模式
        console.log('创建角色:', values);
      }
      
      setIsModalVisible(false);
      setEditingRole(null);
      form.resetFields();
      onSuccess();
      return true;
    } catch (error) {
      console.error('表单提交失败:', error);
      return false;
    } finally {
      setSubmitLoading(false);
    }
  }, [form, editingRole, onSuccess]);

  return {
    form,
    isModalVisible,
    editingRole,
    submitLoading,
    handleAdd,
    handleEdit,
    handleCancel,
    handleSubmit,
  };
}
