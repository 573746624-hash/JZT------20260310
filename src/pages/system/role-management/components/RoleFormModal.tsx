/**
 * 角色表单弹窗组件
 * @file components/RoleFormModal.tsx
 * @desc 角色创建和编辑表单
 */

import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Radio,
  Tree,
  Card,
  Typography,
  Space,
} from 'antd';
import type { Role, PermissionTreeNode } from '../types';
import { dataScopeOptions } from '../config/roleConfig';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface RoleFormModalProps {
  visible: boolean;
  editingRole: Role | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

// 模拟权限树数据
const permissionTreeData: PermissionTreeNode[] = [
  {
    id: '1',
    key: 'user:*',
    title: '用户管理',
    name: '用户管理',
    code: 'user:*',
    type: 'menu',
    parentId: null,
    path: '/system/users',
    sort: 1,
    children: [
      { id: '1-1', key: 'user:view', title: '查看用户', name: '查看用户', code: 'user:view', type: 'button', parentId: '1', path: '', sort: 1 },
      { id: '1-2', key: 'user:create', title: '创建用户', name: '创建用户', code: 'user:create', type: 'button', parentId: '1', path: '', sort: 2 },
      { id: '1-3', key: 'user:edit', title: '编辑用户', name: '编辑用户', code: 'user:edit', type: 'button', parentId: '1', path: '', sort: 3 },
      { id: '1-4', key: 'user:delete', title: '删除用户', name: '删除用户', code: 'user:delete', type: 'button', parentId: '1', path: '', sort: 4 },
    ],
  },
  {
    id: '2',
    key: 'role:*',
    title: '角色管理',
    name: '角色管理',
    code: 'role:*',
    type: 'menu',
    parentId: null,
    path: '/system/roles',
    sort: 2,
    children: [
      { id: '2-1', key: 'role:view', title: '查看角色', name: '查看角色', code: 'role:view', type: 'button', parentId: '2', path: '', sort: 1 },
      { id: '2-2', key: 'role:create', title: '创建角色', name: '创建角色', code: 'role:create', type: 'button', parentId: '2', path: '', sort: 2 },
      { id: '2-3', key: 'role:edit', title: '编辑角色', name: '编辑角色', code: 'role:edit', type: 'button', parentId: '2', path: '', sort: 3 },
      { id: '2-4', key: 'role:delete', title: '删除角色', name: '删除角色', code: 'role:delete', type: 'button', parentId: '2', path: '', sort: 4 },
    ],
  },
  {
    id: '3',
    key: 'log:*',
    title: '日志管理',
    name: '日志管理',
    code: 'log:*',
    type: 'menu',
    parentId: null,
    path: '/system/logs',
    sort: 3,
    children: [
      { id: '3-1', key: 'log:view', title: '查看日志', name: '查看日志', code: 'log:view', type: 'button', parentId: '3', path: '', sort: 1 },
      { id: '3-2', key: 'log:export', title: '导出日志', name: '导出日志', code: 'log:export', type: 'button', parentId: '3', path: '', sort: 2 },
    ],
  },
  {
    id: '4',
    key: 'config:*',
    title: '系统配置',
    name: '系统配置',
    code: 'config:*',
    type: 'menu',
    parentId: null,
    path: '/system/config',
    sort: 4,
    children: [
      { id: '4-1', key: 'config:view', title: '查看配置', name: '查看配置', code: 'config:view', type: 'button', parentId: '4', path: '', sort: 1 },
      { id: '4-2', key: 'config:edit', title: '修改配置', name: '修改配置', code: 'config:edit', type: 'button', parentId: '4', path: '', sort: 2 },
    ],
  },
];

const RoleFormModal: React.FC<RoleFormModalProps> = ({
  visible,
  editingRole,
  loading,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!editingRole;

  return (
    <Modal
      title={isEditing ? '编辑角色' : '新增角色'}
      open={visible}
      width={700}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: true,
          dataScope: 'self',
          permissions: [],
        }}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[
            { required: true, message: '请输入角色名称' },
            { max: 50, message: '角色名称最多50个字符' },
          ]}
        >
          <Input placeholder="请输入角色名称，如：部门管理员" />
        </Form.Item>

        <Form.Item
          name="code"
          label="角色编码"
          rules={[
            { required: true, message: '请输入角色编码' },
            { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
          ]}
        >
          <Input
            placeholder="请输入角色编码，如：dept_admin"
            disabled={isEditing}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="角色描述"
          rules={[{ max: 200, message: '描述最多200个字符' }]}
        >
          <TextArea
            rows={3}
            placeholder="请输入角色描述，说明该角色的职责和权限范围"
          />
        </Form.Item>

        <Form.Item
          name="dataScope"
          label="数据范围"
          rules={[{ required: true, message: '请选择数据范围' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              {dataScopeOptions.map(option => (
                <Radio key={option.value} value={option.value}>
                  <Space direction="vertical" size={0}>
                    <Text strong>{option.label}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {option.description}
                    </Text>
                  </Space>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="permissions"
          label="权限配置"
        >
          <Card size="small" title="选择权限" bodyStyle={{ maxHeight: 300, overflow: 'auto' }}>
            <Tree
              checkable
              treeData={permissionTreeData}
              defaultExpandAll
            />
          </Card>
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleFormModal;
