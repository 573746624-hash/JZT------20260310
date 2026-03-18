// 用户角色定义
export type UserRole = 'buyer' | 'supplier' | 'operator' | 'guest';

// 权限定义
export interface Permission {
  id: string;
  name: string;
  description: string;
}

// 权限列表
export const PERMISSIONS = {
  // 浏览权限
  VIEW_SERVICES: { id: 'view_services', name: '浏览服务', description: '查看服务列表和详情' },
  VIEW_REQUIREMENTS: { id: 'view_requirements', name: '浏览需求', description: '查看采购需求列表和详情' },
  
  // 发布权限
  PUBLISH_REQUIREMENT: { id: 'publish_requirement', name: '发布需求', description: '发布采购需求' },
  PUBLISH_SERVICE: { id: 'publish_service', name: '发布服务', description: '发布服务信息' },
  
  // 交互权限
  CONTACT_SUPPLIER: { id: 'contact_supplier', name: '联系供应商', description: '与供应商进行沟通' },
  CONTACT_BUYER: { id: 'contact_buyer', name: '联系采购方', description: '与采购方进行沟通' },
  FAVORITE_ITEM: { id: 'favorite_item', name: '收藏功能', description: '收藏服务或需求' },
  
  // 管理权限
  EDIT_OWN_CONTENT: { id: 'edit_own_content', name: '编辑自己的内容', description: '编辑自己发布的内容' },
  DELETE_OWN_CONTENT: { id: 'delete_own_content', name: '删除自己的内容', description: '删除自己发布的内容' },
  
  // 运营权限
  APPROVE_CONTENT: { id: 'approve_content', name: '审核内容', description: '审核用户发布的内容' },
  MANAGE_USERS: { id: 'manage_users', name: '用户管理', description: '管理平台用户' },
  VIEW_ANALYTICS: { id: 'view_analytics', name: '查看数据', description: '查看平台数据分析' },
  ASSIGN_FOLLOW_UP: { id: 'assign_follow_up', name: '分配跟进', description: '分配业务跟进人员' }
} as const;

// 角色权限映射
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.VIEW_REQUIREMENTS
  ],
  
  buyer: [
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.VIEW_REQUIREMENTS,
    PERMISSIONS.PUBLISH_REQUIREMENT,
    PERMISSIONS.CONTACT_SUPPLIER,
    PERMISSIONS.FAVORITE_ITEM,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.DELETE_OWN_CONTENT
  ],
  
  supplier: [
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.VIEW_REQUIREMENTS,
    PERMISSIONS.PUBLISH_SERVICE,
    PERMISSIONS.CONTACT_BUYER,
    PERMISSIONS.FAVORITE_ITEM,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.DELETE_OWN_CONTENT
  ],
  
  operator: [
    PERMISSIONS.VIEW_SERVICES,
    PERMISSIONS.VIEW_REQUIREMENTS,
    PERMISSIONS.PUBLISH_REQUIREMENT,
    PERMISSIONS.PUBLISH_SERVICE,
    PERMISSIONS.CONTACT_SUPPLIER,
    PERMISSIONS.CONTACT_BUYER,
    PERMISSIONS.FAVORITE_ITEM,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.DELETE_OWN_CONTENT,
    PERMISSIONS.APPROVE_CONTENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.ASSIGN_FOLLOW_UP
  ]
};

// 权限检查函数
export const hasPermission = (userRole: UserRole, permissionId: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.some(permission => permission.id === permissionId);
};

// 获取用户所有权限
export const getUserPermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};

// 权限检查装饰器
export const requirePermission = (permissionId: string) => {
  return (userRole: UserRole) => {
    return hasPermission(userRole, permissionId);
  };
};

// 批量权限检查
export const hasAnyPermission = (userRole: UserRole, permissionIds: string[]): boolean => {
  return permissionIds.some(permissionId => hasPermission(userRole, permissionId));
};

export const hasAllPermissions = (userRole: UserRole, permissionIds: string[]): boolean => {
  return permissionIds.every(permissionId => hasPermission(userRole, permissionId));
};
