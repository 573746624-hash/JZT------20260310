/**
 * 角色管理页面
 * @file index.tsx
 * @desc 角色列表、增删改查、权限配置
 */

import React from 'react';
import {
  Card,
  Button,
  Input,
  Table,
  Tag,
  Space,
  Popconfirm,
  Switch,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useRoleManagement, useRoleForm } from './hooks';
import { RoleFormModal } from './components';
import { tableColumns, paginationConfig } from './config/roleConfig';
import { DataScope } from './types';

const { Search } = Input;

/**
 * 数据范围标签渲染
 */
const renderDataScope = (scope: DataScope) => {
  const scopeMap = {
    all: { color: 'red', label: '全部' },
    dept: { color: 'orange', label: '部门' },
    self: { color: 'green', label: '个人' },
  };
  const config = scopeMap[scope] || scopeMap.self;
  return <Tag color={config.color}>{config.label}</Tag>;
};

const RoleManagement: React.FC = () => {
  // 角色列表管理
  const {
    roles,
    loading,
    total,
    params,
    handleSearch,
    handlePageChange,
    deleteRole,
    toggleRoleStatus,
    loadRoles,
  } = useRoleManagement();

  // 角色表单管理
  const {
    form,
    isModalVisible,
    editingRole,
    submitLoading,
    handleAdd,
    handleEdit,
    handleCancel,
    handleSubmit,
  } = useRoleForm(loadRoles);

  // 确认删除
  const handleDeleteConfirm = async (id: string) => {
    const success = await deleteRole(id);
    if (success) {
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
  };

  // 切换状态
  const handleStatusChange = async (id: string, checked: boolean) => {
    const success = await toggleRoleStatus(id, checked);
    if (success) {
      message.success(checked ? '已启用' : '已禁用');
    } else {
      message.error('操作失败');
    }
  };

  // 表格列配置
  const columns = [
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '数据范围',
      dataIndex: 'dataScope',
      key: 'dataScope',
      width: 100,
      align: 'center' as const,
      render: renderDataScope,
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
      render: (status: boolean, record: any) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          size="small"
        />
      ),
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
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除角色 "${record.name}" 吗？`}
            onConfirm={() => handleDeleteConfirm(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 180px)' }}>
      <Card>
        {/* 搜索栏 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="搜索角色名称、编码或描述"
            allowClear
            enterButton={<><SearchOutlined /> 搜索</>}
            onSearch={handleSearch}
            style={{ width: 350 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增角色
          </Button>
        </div>

        {/* 角色表格 */}
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={{
            ...paginationConfig,
            current: params.page,
            pageSize: params.pageSize,
            total,
            onChange: handlePageChange,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* 角色表单弹窗 */}
      <RoleFormModal
        visible={isModalVisible}
        editingRole={editingRole}
        loading={submitLoading}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RoleManagement;
