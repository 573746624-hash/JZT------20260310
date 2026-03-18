import React, { createContext, useContext, ReactNode } from 'react';
import { UserRole, Permission, hasPermission, getUserPermissions } from '../../utils/permissions';

interface PermissionContextType {
  userRole: UserRole;
  permissions: Permission[];
  hasPermission: (permissionId: string) => boolean;
  canAccess: (permissionIds: string | string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  userRole: UserRole;
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  userRole,
  children
}) => {
  const permissions = getUserPermissions(userRole);

  const checkPermission = (permissionId: string): boolean => {
    return hasPermission(userRole, permissionId);
  };

  const canAccess = (permissionIds: string | string[]): boolean => {
    if (typeof permissionIds === 'string') {
      return checkPermission(permissionIds);
    }
    return permissionIds.some(id => checkPermission(id));
  };

  const contextValue: PermissionContextType = {
    userRole,
    permissions,
    hasPermission: checkPermission,
    canAccess
  };

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

// 权限控制组件
interface PermissionGateProps {
  permission: string | string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const { canAccess } = usePermissions();

  if (!canAccess(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// 高阶组件：权限包装
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string | string[],
  fallback?: ReactNode
) => {
  return (props: P) => (
    <PermissionGate permission={requiredPermission} fallback={fallback}>
      <Component {...props} />
    </PermissionGate>
  );
};
